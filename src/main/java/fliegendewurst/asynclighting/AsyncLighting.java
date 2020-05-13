package fliegendewurst.asynclighting;

import com.google.common.collect.Sets;
import net.minecraft.client.Minecraft;
import net.minecraft.util.math.BlockPos;
import net.minecraft.util.math.ChunkPos;
import net.minecraft.util.math.SectionPos;
import net.minecraft.world.LightType;
import net.minecraft.world.chunk.NibbleArray;
import net.minecraft.world.lighting.WorldLightManager;
import net.minecraftforge.client.event.RenderGameOverlayEvent;
import net.minecraftforge.common.MinecraftForge;
import net.minecraftforge.event.TickEvent;
import net.minecraftforge.event.world.WorldEvent;
import net.minecraftforge.eventbus.api.EventPriority;
import net.minecraftforge.eventbus.api.SubscribeEvent;
import net.minecraftforge.fml.common.Mod;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.annotation.Nullable;
import java.util.Iterator;
import java.util.Set;
import java.util.concurrent.BlockingDeque;
import java.util.concurrent.LinkedBlockingDeque;
import java.util.concurrent.TimeUnit;

@Mod("asynclighting")
public class AsyncLighting {
	public static final String MODID = "asynclighting";
	public static final Logger LOGGER = LogManager.getLogger(MODID);

	public static Minecraft mc;

	private static final BlockingDeque<Runnable> LIGHT_QUEUE = new LinkedBlockingDeque<>();

	private static boolean tickingLight = false;

	public AsyncLighting() {
		AsyncLighting.mc = Minecraft.getInstance();

		new Thread(AsyncLighting::processLightTicks, "Light thread").start();

		MinecraftForge.EVENT_BUS.register(this);
	}

	@SubscribeEvent
	public void drawDebugText(RenderGameOverlayEvent.Text event) {
		if (!Minecraft.getInstance().gameSettings.showDebugInfo) {
			return;
		}
		if (!SECTION_LIGHT_UPDATES.isEmpty() || !BLOCK_LIGHT_UPDATES.isEmpty()) {
			event.getLeft().add("");
		}
		if (!SECTION_LIGHT_UPDATES.isEmpty())
			event.getLeft().add(String.format("%s section updates pending", SECTION_LIGHT_UPDATES.size()));
		if (!BLOCK_LIGHT_UPDATES.isEmpty())
			event.getLeft().add(String.format("%s block updates pending", BLOCK_LIGHT_UPDATES.size()));
	}

	@SubscribeEvent(priority = EventPriority.HIGHEST)
	public void worldUnload(WorldEvent.Unload event) {
		BLOCK_LIGHT_UPDATES.clear();
		SECTION_LIGHT_UPDATES.clear();
	}

	@SubscribeEvent
	public void onRenderStart(TickEvent.RenderTickEvent event) {
		if (event.phase == TickEvent.Phase.END && !tickingLight) {
			// apply block light updates (queue for rendering)
			Iterator<BlockPos> iter = BLOCK_LIGHT_UPDATES.iterator();
			if (iter.hasNext()) {
				BlockPos pos = iter.next();
				if (mc.worldRenderer == null) {
					BLOCK_LIGHT_UPDATES.clear();
					SECTION_LIGHT_UPDATES.clear();
					return;
				}
				mc.worldRenderer.markBlockRangeForRenderUpdate(pos.getX(), pos.getY(), pos.getZ(), pos.getX(), pos.getY(), pos.getZ());
				BLOCK_LIGHT_UPDATES.remove(pos);
			}
			Iterator<SectionPos> iter2 = SECTION_LIGHT_UPDATES.iterator();
			if (iter2.hasNext()) {
				SectionPos pos = iter2.next();
				if (mc.worldRenderer == null) {
					BLOCK_LIGHT_UPDATES.clear();
					SECTION_LIGHT_UPDATES.clear();
					return;
				}
				//LOGGER.debug("rendering section {} {} {}", pos.getX(), pos.getY(), pos.getZ());
				mc.worldRenderer.markForRerender(pos.getX(), pos.getY(), pos.getZ());
				//mc.worldRenderer.markSurroundingsForRerender(pos.getX(), pos.getY(), pos.getZ());
				SECTION_LIGHT_UPDATES.remove(pos);
			}
		}
	}

	public static boolean uploadMore() {
		if (mc.player != null) {
			// lowest possible motion (standing still) is: 0.006146560239257815
			return mc.player.getMotion().lengthSquared() < 0.0073;
		} else {
			return false;
		}
	}

	public static void tickLightManager(WorldLightManager lightManager, int toUpdateCount, boolean updateSkyLight, boolean updateBlockLight) {
		//LOGGER.debug("ticking light {} {} {} {}", lightManager, toUpdateCount, updateSkyLight, updateBlockLight);
		try {
			LIGHT_QUEUE.putLast(new LightTick(lightManager, toUpdateCount, updateSkyLight, updateBlockLight));
		} catch (InterruptedException e) {
			LOGGER.warn("light ticking interrupted");
		}
	}

	public static void enableLightSources(WorldLightManager lightManager, ChunkPos pos, boolean b) {
		//LOGGER.debug("enabling light {} {}", pos, b);
		try {
			LIGHT_QUEUE.putLast(new LightEnable(lightManager, pos, b));
		} catch (InterruptedException e) {
			LOGGER.warn("light enabling interrupted");
		}
	}

	public static void updateSectionStatus(WorldLightManager lightManager, SectionPos pos, boolean b) {
		//LOGGER.debug("updating section {} {}", pos, b);
		try {
			LIGHT_QUEUE.putLast(new LightUpdate(lightManager, pos, b));
		} catch (InterruptedException e) {
			LOGGER.warn("light section update interrupted");
		}
	}

	public static void setData(WorldLightManager lightManager, LightType type, SectionPos pos, @Nullable NibbleArray b) {
		//LOGGER.debug("setting data {} {}", type, pos);
		try {
			LIGHT_QUEUE.putLast(new SetData(lightManager, type, pos, b));
		} catch (InterruptedException e) {
			LOGGER.warn("light data interrupted");
		}
	}

	public static void checkBlock(WorldLightManager lightManager, BlockPos pos) {
		//LOGGER.debug("checking block {}", pos);
		try {
			LIGHT_QUEUE.putLast(new CheckBlock(lightManager, pos));
		} catch (InterruptedException e) {
			LOGGER.warn("light check block interrupted");
		}
	}

	// only called in the ServerWorldLightManager
	public static void blockEmission(WorldLightManager lightManager, BlockPos pos, int i) {
		try {
			LIGHT_QUEUE.putLast(new BlockEmission(lightManager, pos, i));
		} catch (InterruptedException e) {
			LOGGER.warn("block emission increase interrupted");
		}
	}

	private static final Set<BlockPos> BLOCK_LIGHT_UPDATES = Sets.newConcurrentHashSet();
	private static final Set<SectionPos> SECTION_LIGHT_UPDATES = Sets.newConcurrentHashSet();

	private static void processLightTicks() {
		while (true) {
			try {
				Runnable tick = LIGHT_QUEUE.takeFirst();
				/* queue will never fill up (since thread never waits on render to finish)
				if (LIGHT_QUEUE.remainingCapacity() < 100) {
					LOGGER.warn("light tick queue almost full: {} slots remaining", LIGHT_QUEUE.remainingCapacity());
				}
				 */
				Minecraft mc = Minecraft.getInstance();
				//Set<BlockPos> updated = new HashSet<>();
				long start = System.currentTimeMillis();
				int counter = 0;
				if (mc.world == null) {
					// world exited
					LIGHT_QUEUE.clear();
					continue;
				}
				while (tick != null) {
					tickingLight = true;
					tick.run();
					counter++;
					if (tick instanceof CheckBlock) {
						BlockPos pos = ((CheckBlock) tick).pos;
						//updated.add(pos);
						BLOCK_LIGHT_UPDATES.add(pos);
					} else if (tick instanceof LightUpdate) {
						SECTION_LIGHT_UPDATES.add(((LightUpdate) tick).pos);
					} else if (tick instanceof SetData) {
						SECTION_LIGHT_UPDATES.add(((SetData) tick).pos);
					}
					tick = LIGHT_QUEUE.pollFirst(1, TimeUnit.MILLISECONDS);
				}
				/*
				for (BlockPos pos : updated) {
					mc.worldRenderer.markBlockRangeForRenderUpdate(pos.getX(), pos.getY(), pos.getZ(), pos.getX(), pos.getY(), pos.getZ());
					//mc.worldRenderer.notifyBlockUpdate(mc.world, pos, mc.world.getBlockState(pos), mc.world.getBlockState(pos), 8 | 1);
					//mc.worldRenderer.markSurroundingsForRerender(pos.getX(), pos.getY(), pos.getZ());
				}
				 */
				tickingLight = false;
				long time = System.currentTimeMillis() - start;
				if (time > 100) {
					LOGGER.warn("processing {} light updates: {} ms", counter, time);
				}
			} catch (InterruptedException e) {
				LOGGER.warn("light ticking thread interrupted");
			}
		}
	}

	/*
	private static void processBlockUpdates() {
		try {
			while (true) {
				while (rendering) {
					// do not update lights in current frame
					Thread.sleep(1);
				}

			}
		} catch (InterruptedException e) {
			LOGGER.warn("block light update thread interrupted");
		}
	}
	 */

	private static class LightTick implements Runnable {
		WorldLightManager lightManager;
		int toUpdateCount;
		boolean updateSkyLight;
		boolean updateBlockLight;

		LightTick(WorldLightManager lightManager, int toUpdateCount, boolean updateSkyLight, boolean updateBlockLight) {
			this.lightManager = lightManager;
			this.toUpdateCount = toUpdateCount;
			this.updateSkyLight = updateSkyLight;
			this.updateBlockLight = updateBlockLight;
		}

		@Override
		public void run() {
			lightManager.tick(toUpdateCount, updateSkyLight, updateBlockLight);
		}
	}

	private static class LightEnable implements Runnable {
		WorldLightManager lightManager;
		ChunkPos pos;
		boolean b;

		LightEnable(WorldLightManager lightManager, ChunkPos pos, boolean b) {
			this.lightManager = lightManager;
			this.pos = pos;
			this.b = b;
		}

		@Override
		public void run() {
			if (lightManager.blockLight != null) {
				lightManager.blockLight.func_215620_a(pos, b);
			}
			if (lightManager.skyLight != null) {
				lightManager.skyLight.func_215620_a(pos, b);
			}
		}
	}

	private static class LightUpdate implements Runnable {
		WorldLightManager lightManager;
		SectionPos pos;
		boolean b;

		LightUpdate(WorldLightManager lightManager, SectionPos pos, boolean b) {
			this.lightManager = lightManager;
			this.pos = pos;
			this.b = b;
		}

		@Override
		public void run() {
			if (lightManager.blockLight != null) {
				lightManager.blockLight.updateSectionStatus(pos, b);
			}
			if (lightManager.skyLight != null) {
				lightManager.skyLight.updateSectionStatus(pos, b);
			}
		}
	}

	private static class SetData implements Runnable {
		WorldLightManager lightManager;
		LightType block;
		SectionPos pos;
		@Nullable
		NibbleArray b;

		SetData(WorldLightManager lightManager, LightType type, SectionPos pos, @Nullable NibbleArray b) {
			this.lightManager = lightManager;
			this.block = type;
			this.pos = pos;
			this.b = b;
		}

		@Override
		public void run() {
			if (block == LightType.BLOCK) {
				if (lightManager.blockLight != null) {
					lightManager.blockLight.setData(pos.asLong(), b);
				}
			} else if (lightManager.skyLight != null) {
				lightManager.skyLight.setData(pos.asLong(), b);
			}
		}
	}

	private static class CheckBlock implements Runnable {
		WorldLightManager lightManager;
		BlockPos pos;

		CheckBlock(WorldLightManager lightManager, BlockPos pos) {
			this.lightManager = lightManager;
			this.pos = pos;
		}

		@Override
		public void run() {
			if (lightManager.blockLight != null) {
				lightManager.blockLight.checkLight(pos);
			}

			if (lightManager.skyLight != null) {
				lightManager.skyLight.checkLight(pos);
			}
		}
	}

	private static class BlockEmission implements Runnable {
		WorldLightManager lightManager;
		BlockPos pos;
		int i;

		BlockEmission(WorldLightManager lightManager, BlockPos pos, int i) {
			this.lightManager = lightManager;
			this.pos = pos;
			this.i = i;
		}

		@Override
		public void run() {
			if (lightManager.blockLight != null) {
				lightManager.blockLight.func_215623_a(pos, i);
			}
		}
	}
}
