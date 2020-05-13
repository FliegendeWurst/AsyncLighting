/**
 * This function is called by Forge before any minecraft classes are loaded to
 * setup the coremod.
 *
 * @return {object} All the transformers of this coremod.
 */
function initializeCoreMod() {
	/*Class/Interface*/ Opcodes = Java.type("org.objectweb.asm.Opcodes");
	/*Class*/ ASMAPI = Java.type("net.minecraftforge.coremod.api.ASMAPI");;

	/*Class*/ InsnList = Java.type("org.objectweb.asm.tree.InsnList");
	/*Class*/ LabelNode = Java.type("org.objectweb.asm.tree.LabelNode");

	/*Class*/ FieldNode = Java.type("org.objectweb.asm.tree.FieldNode");
	/*Class*/ MethodNode = Java.type("org.objectweb.asm.tree.MethodNode");

	/*Class*/ AbstractInsnNode = Java.type("org.objectweb.asm.tree.AbstractInsnNode");
	/*Class*/ InsnNode = Java.type("org.objectweb.asm.tree.InsnNode");
	/*Class*/ VarInsnNode = Java.type("org.objectweb.asm.tree.VarInsnNode");
	/*Class*/ LdcInsnNode = Java.type("org.objectweb.asm.tree.LdcInsnNode");
	/*Class*/ FieldInsnNode = Java.type("org.objectweb.asm.tree.FieldInsnNode");
	/*Class*/ MethodInsnNode = Java.type("org.objectweb.asm.tree.MethodInsnNode");
	/*Class*/ JumpInsnNode = Java.type("org.objectweb.asm.tree.JumpInsnNode");
	/*Class*/ TypeInsnNode = Java.type("org.objectweb.asm.tree.TypeInsnNode");

	ACC_PUBLIC = Opcodes.ACC_PUBLIC;

	INVOKESTATIC = Opcodes.INVOKESTATIC;
	INVOKEVIRTUAL = Opcodes.INVOKEVIRTUAL;

	ALOAD = Opcodes.ALOAD;
	ILOAD = Opcodes.ILOAD;
	FLOAD = Opcodes.FLOAD;
	DLOAD = Opcodes.DLOAD;

	ASTORE = Opcodes.ASTORE;
	ISTORE = Opcodes.ISTORE;

	RETURN = Opcodes.RETURN;
	ARETURN = Opcodes.ARETURN;
	IRETURN = Opcodes.IRETURN;
	DRETURN = Opcodes.DRETURN;

	NEW = Opcodes.NEW;

	MONITORENTER = Opcodes.MONITORENTER;
	MONITOREXIT = Opcodes.MONITOREXIT;

	ACONST_NULL = Opcodes.ACONST_NULL;
	ICONST_0 = Opcodes.ICONST_0;

	IFEQ = Opcodes.IFEQ;
	IFNE = Opcodes.IFNE;
	IF_ACMPEQ = Opcodes.IF_ACMPEQ;
	IFNULL = Opcodes.IFNULL;

	GETFIELD = Opcodes.GETFIELD;
	GETSTATIC = Opcodes.GETSTATIC;

	GOTO = Opcodes.GOTO;
	FRAME = Opcodes.FRAME;

	LABEL = AbstractInsnNode.LABEL;
	METHOD_INSN = AbstractInsnNode.METHOD_INSN;
	VAR_INSN = AbstractInsnNode.VAR_INSN;

	return {
		"WorldRenderer modify updateCameraAndRender": {
			"target": {
				"type": "METHOD",
				"class": "net.minecraft.client.renderer.WorldRenderer",
				"methodName": "func_228426_a_", // updateCameraAndRender func_228426_a_
				"methodDesc": "(Lcom/mojang/blaze3d/matrix/MatrixStack;FJZLnet/minecraft/client/renderer/ActiveRenderInfo;Lnet/minecraft/client/renderer/GameRenderer;Lnet/minecraft/client/renderer/LightTexture;Lnet/minecraft/client/renderer/Matrix4f;)V"
			},
			"transformer": function (method) {
				//printInstructions(method.instructions);
				var toInject = new InsnList();
				var callback = new MethodInsnNode(INVOKESTATIC, "fliegendewurst/asynclighting/AsyncLighting", "tickLightManager", "(Lnet/minecraft/world/lighting/WorldLightManager;IZZ)V");
				// 40 to 47 need to go (method call has to be wrapped)
				for (var i = 0; i < 48; i++) {
					toInject.add(method.instructions.get(i));
				}
				toInject.add(callback);
				for (var i = 50; i < method.instructions.size(); i++) {
					toInject.add(method.instructions.get(i));
				}
				method.instructions.clear();
				method.instructions.add(toInject);
				//printInstructions(method.instructions);
				return method;
			}
		},
		"WorldLightManager#enableLightSources": {
			"target": {
				"type": "METHOD",
				"class": "net.minecraft.world.lighting.WorldLightManager",
				"methodName": "func_215571_a", // enableLightSources func_215571_a
				"methodDesc": "(Lnet/minecraft/util/math/ChunkPos;Z)V"
			},
			"transformer": function (method) {
				//printInstructions(method.instructions);
				var toInject = new InsnList();
				var callback = new MethodInsnNode(INVOKESTATIC, "fliegendewurst/asynclighting/AsyncLighting", "enableLightSources", "(Lnet/minecraft/world/lighting/WorldLightManager;Lnet/minecraft/util/math/ChunkPos;Z)V");
				// load parameters
				toInject.add(new VarInsnNode(ALOAD, 0));
				for (var i = 9; i <= 10; i++) {
					toInject.add(method.instructions.get(i));
				}
				toInject.add(callback);
				toInject.add(new InsnNode(RETURN));
				method.instructions.clear();
				method.instructions.add(toInject);
				//printInstructions(method.instructions);
				return method;
			}
		},
		"WorldLightManager#updateSectionStatus": {
			"target": {
				"type": "METHOD",
				"class": "net.minecraft.world.lighting.WorldLightManager",
				"methodName": "func_215566_a", // updateSectionStatus func_215566_a
				"methodDesc": "(Lnet/minecraft/util/math/SectionPos;Z)V"
			},
			"transformer": function (method) {
				//printInstructions(method.instructions);
				var toInject = new InsnList();
				var callback = new MethodInsnNode(INVOKESTATIC, "fliegendewurst/asynclighting/AsyncLighting", "updateSectionStatus", "(Lnet/minecraft/world/lighting/WorldLightManager;Lnet/minecraft/util/math/SectionPos;Z)V");
				// load parameters
				toInject.add(new VarInsnNode(ALOAD, 0));
				for (var i = 9; i <= 10; i++) {
					toInject.add(method.instructions.get(i));
				}
				toInject.add(callback);
				toInject.add(new InsnNode(RETURN));
				method.instructions.clear();
				method.instructions.add(toInject);
				//printInstructions(method.instructions);
				return method;
			}
		},
		"WorldLightManager#setData": {
			"target": {
				"type": "METHOD",
				"class": "net.minecraft.world.lighting.WorldLightManager",
				"methodName": "func_215574_a", // setData func_215574_a
				"methodDesc": "(Lnet/minecraft/world/LightType;Lnet/minecraft/util/math/SectionPos;Lnet/minecraft/world/chunk/NibbleArray;)V"
			},
			"transformer": function (method) {
				//printInstructions(method.instructions);
				var toInject = new InsnList();
				var callback = new MethodInsnNode(INVOKESTATIC, "fliegendewurst/asynclighting/AsyncLighting", "setData", "(Lnet/minecraft/world/lighting/WorldLightManager;Lnet/minecraft/world/LightType;Lnet/minecraft/util/math/SectionPos;Lnet/minecraft/world/chunk/NibbleArray;)V");
				// load parameters
				toInject.add(new VarInsnNode(ALOAD, 0));
				toInject.add(new VarInsnNode(ALOAD, 1));
				toInject.add(new VarInsnNode(ALOAD, 2));
				toInject.add(new VarInsnNode(ALOAD, 3));
				toInject.add(callback);
				toInject.add(new InsnNode(RETURN));
				method.instructions.clear();
				method.instructions.add(toInject);
				//printInstructions(method.instructions);
				return method;
			}
		},
		"less unnecessary rendering": {
			"target": {
				"type": "METHOD",
				"class": "net.minecraft.client.network.play.ClientPlayNetHandler",
				// setLightData func_217284_a (IILnet/minecraft/world/lighting/WorldLightManager;Lnet/minecraft/world/LightType;IILjava/util/Iterator;)V
				"methodName": "func_217284_a",
				"methodDesc": "(IILnet/minecraft/world/lighting/WorldLightManager;Lnet/minecraft/world/LightType;IILjava/util/Iterator;)V"
			},
			"transformer": function (method) {
				//printInstructions(method.instructions);
				var toInject = new InsnList();
				for (var i = 0; i <= 81; i++) {
					toInject.add(method.instructions.get(i));
				}
				// ignore markForRerender
				for (var i = 90; i < method.instructions.size(); i++) {
					toInject.add(method.instructions.get(i));
				}
				method.instructions.clear();
				method.instructions.add(toInject);
				return method;
			}
		},
		"less unnecessary rendering #2": {
			"target": {
				"type": "METHOD",
				"class": "net.minecraft.client.network.play.ClientPlayNetHandler",
				// processChunkUnload func_184326_a (Lnet/minecraft/network/play/server/SUnloadChunkPacket;)V
				"methodName": "func_184326_a",
				"methodDesc": "(Lnet/minecraft/network/play/server/SUnloadChunkPacket;)V"
			},
			"transformer": function (method) {
				//printInstructions(method.instructions);
				var toInject = new InsnList();
				for (var i = 0; i <= 42; i++) {
					toInject.add(method.instructions.get(i));
				}
				// ignore markForRerender
				for (var i = 51; i < method.instructions.size(); i++) {
					toInject.add(method.instructions.get(i));
				}
				method.instructions.clear();
				method.instructions.add(toInject);
				return method;
			}
		},
		"less unnecessary rendering #3": {
			"target": {
				"type": "METHOD",
				"class": "net.minecraft.client.network.play.ClientPlayNetHandler",
				// handleChunkData func_147263_a (Lnet/minecraft/network/play/server/SChunkDataPacket;)V
				"methodName": "func_147263_a",
				"methodDesc": "(Lnet/minecraft/network/play/server/SChunkDataPacket;)V"
			},
			"transformer": function (method) {
				//printInstructions(method.instructions);
				var toInject = new InsnList();
				for (var i = 0; i <= 56; i++) {
					toInject.add(method.instructions.get(i));
				}
				// ignore markForRerender
				for (var i = 65; i < method.instructions.size(); i++) {
					toInject.add(method.instructions.get(i));
				}
				method.instructions.clear();
				method.instructions.add(toInject);
				return method;
			}
		},
		/*
		"network debugging": {
			"target": {
				"type": "METHOD",
				"class": "net.minecraft.network.NetworkManager",
				// exceptionCaught (Lio/netty/channel/ChannelHandlerContext;Ljava/lang/Throwable;)V exceptionCaught
				"methodName": "exceptionCaught",
				"methodDesc": "(Lio/netty/channel/ChannelHandlerContext;Ljava/lang/Throwable;)V"
			},
			"transformer": function (method) {
				//printInstructions(method.instructions);
				var toInject = new InsnList();
				toInject.add(new VarInsnNode(ALOAD, 2));
				toInject.add(new MethodInsnNode(INVOKEVIRTUAL, "java/lang/Throwable", "printStackTrace", "()V"));
				method.instructions.insert(toInject);
				return method;
			}
		},
		*/
		"WorldLightManager#checkBlock": {
			"target": {
				"type": "METHOD",
				"class": "net.minecraft.world.lighting.WorldLightManager",
				"methodName": "func_215568_a", // checkBlock func_215568_a (Lnet/minecraft/util/math/BlockPos;)V
				"methodDesc": "(Lnet/minecraft/util/math/BlockPos;)V"
			},
			"transformer": function (method) {
				//printInstructions(method.instructions);
				var toInject = new InsnList();
				var callback = new MethodInsnNode(INVOKESTATIC, "fliegendewurst/asynclighting/AsyncLighting", "checkBlock", "(Lnet/minecraft/world/lighting/WorldLightManager;Lnet/minecraft/util/math/BlockPos;)V");
				// load parameters
				toInject.add(new VarInsnNode(ALOAD, 0));
				toInject.add(new VarInsnNode(ALOAD, 1));
				toInject.add(callback);
				toInject.add(new InsnNode(RETURN));
				method.instructions.clear();
				method.instructions.add(toInject);
				//printInstructions(method.instructions);
				return method;
			}
		},
		"queue call to onBlockEmissionIncrease": {
			"target": {
				"type": "METHOD",
				"class": "net.minecraft.world.lighting.WorldLightManager",
				// func_215573_a (Lnet/minecraft/util/math/BlockPos;I)V onBlockEmissionIncrease
				"methodName": "func_215573_a",
				"methodDesc": "(Lnet/minecraft/util/math/BlockPos;I)V"
			},
			"transformer": function (method) {
				//printInstructions(method.instructions);
				var toInject = new InsnList();
				var callback = new MethodInsnNode(INVOKESTATIC, "fliegendewurst/asynclighting/AsyncLighting", "blockEmission", "(Lnet/minecraft/world/lighting/WorldLightManager;Lnet/minecraft/util/math/BlockPos;I)V");
				// load parameters
				toInject.add(new VarInsnNode(ALOAD, 0));
				toInject.add(new VarInsnNode(ALOAD, 1));
				toInject.add(new VarInsnNode(ILOAD, 2));
				toInject.add(callback);
				toInject.add(new InsnNode(RETURN));
				method.instructions.clear();
				method.instructions.add(toInject);
				//printInstructions(method.instructions);
				return method;
			}
		},
		"World: off-thread rendering": {
			"target": {
				"type": "METHOD",
				"class": "net.minecraft.world.World",
				// markAndNotifyBlock(BlockPos pos, @Nullable Chunk chunk, BlockState blockstate, BlockState newState, int flags)
				"methodName": "markAndNotifyBlock",
				"methodDesc": "(Lnet/minecraft/util/math/BlockPos;Lnet/minecraft/world/chunk/Chunk;Lnet/minecraft/block/BlockState;Lnet/minecraft/block/BlockState;I)V"
			},
			"transformer": function (method) {
				//printInstructions(method.instructions);
				var toInject = new InsnList();
				toInject.add(new VarInsnNode(ILOAD, 5));
				toInject.add(new LdcInsnNode(~8));
				toInject.add(new InsnNode(Opcodes.IAND));
				toInject.add(new VarInsnNode(ISTORE, 5));
				method.instructions.insert(toInject);
				return method;
			}
		},
		"Chunk: never immediately render": {
			"target": {
				"type": "METHOD",
				"class": "net.minecraft.client.renderer.chunk.ChunkRenderDispatcher$ChunkRender",
				// boolean needsImmediateUpdate()
				"methodName": "func_188281_o",
				"methodDesc": "()Z"
			},
			"transformer": function (method) {
				//printInstructions(method.instructions);
				var toInject = new InsnList();
				toInject.add(new LdcInsnNode(false));
				toInject.add(new InsnNode(IRETURN));
				method.instructions.clear();
				method.instructions.insert(toInject);
				return method;
			}
		},
		"ChunkRenderDispatcher: upload chunks slowly": {
			"target": {
				"type": "METHOD",
				"class": "net.minecraft.client.renderer.chunk.ChunkRenderDispatcher",
				// boolean runChunkUploads()
				"methodName": "func_228908_d_",
				"methodDesc": "()Z"
			},
			"transformer": function (method) {
				//printInstructions(method.instructions);
				var toInject = new InsnList();
				toInject.add(new MethodInsnNode(INVOKESTATIC, "fliegendewurst/asynclighting/AsyncLighting", "uploadMore", "()Z"));
				toInject.add(new JumpInsnNode(IFNE, method.instructions.get(18)));
				toInject.add(new VarInsnNode(ILOAD, 1));
				toInject.add(new InsnNode(IRETURN));
				method.instructions.insert(method.instructions.get(17), toInject);
				return method;
			}
		},
		"Open screenshots without blocking on viewer exit": {
			"target": {
				"type": "METHOD",
				"class": "net.minecraft.util.Util$OS",
				// void openURL(java.net.URL)
				"methodName": "func_195639_a",
				"methodDesc": "(Ljava/net/URL;)V"
			},
			"transformer": function (method) {
				//printInstructions(method.instructions);
				var toInject = new InsnList();
				toInject.add(new InsnNode(RETURN));
				method.instructions.insert(method.instructions.get(5), toInject);
				return method;
			}
		},
		/*
		"SectionLightStorage synchronization": {
			"target": {
				"type": "CLASS",
				"name": "net.minecraft.world.lighting.SectionLightStorage"
				//"methodName": "func_215522_a", // updateSections func_215522_a
				//"methodDesc": "(Lnet/minecraft/world/lighting/LightEngine;ZZ)V"
			},
			"transformer": function (clazz) {
				//method.instructions.insert(new InsnNode(MONITORENTER));
				//method.instructions.insert(new VarInsnNode(ALOAD, 0));
				//method.instructions.add(new InsnNode(MONITOREXIT));
				for (var i = 1; i < clazz.methods.size(); i++) {
					var method = clazz.methods.get(i);
					//if (method.name === "getLightOrDefault") {
					if ((method.access & Opcodes.ACC_ABSTRACT) !== 0) {
						continue;
					}
					method.access |= Opcodes.ACC_SYNCHRONIZED;
				}
				return clazz;
			}
		},
		"BlockLightStorage synchronization": {
			"target": {
				"type": "CLASS",
				"name": "net.minecraft.world.lighting.BlockLightStorage"
			},
			"transformer": function (clazz) {
				for (var i = 1; i < clazz.methods.size(); i++) {
					var method = clazz.methods.get(i);
					if ((method.access & Opcodes.ACC_ABSTRACT) !== 0) {
						continue;
					}
					method.access |= Opcodes.ACC_SYNCHRONIZED;
				}
				return clazz;
			}
		},
		"SkyLightStorage synchronization": {
			"target": {
				"type": "CLASS",
				"name": "net.minecraft.world.lighting.SkyLightStorage"
			},
			"transformer": function (clazz) {
				for (var i = 1; i < clazz.methods.size(); i++) {
					var method = clazz.methods.get(i);
					if ((method.access & Opcodes.ACC_ABSTRACT) !== 0) {
						continue;
					}
					method.access |= Opcodes.ACC_SYNCHRONIZED;
				}
				return clazz;
			}
		},
		"SectionDistanceGraph synchronization": {
			"target": {
				"type": "CLASS",
				"name": "net.minecraft.util.SectionDistanceGraph"
			},
			"transformer": function (clazz) {
				for (var i = 1; i < clazz.methods.size(); i++) {
					var method = clazz.methods.get(i);
					if ((method.access & Opcodes.ACC_ABSTRACT) !== 0) {
						continue;
					}
					method.access |= Opcodes.ACC_SYNCHRONIZED;
				}
				return clazz;
			}
		},
		"LevelBasedGraph synchronization": {
			"target": {
				"type": "CLASS",
				"name": "net.minecraft.world.lighting.LevelBasedGraph"
			},
			"transformer": function (clazz) {
				for (var i = 1; i < clazz.methods.size(); i++) {
					var method = clazz.methods.get(i);
					if ((method.access & Opcodes.ACC_ABSTRACT) !== 0) {
						continue;
					}
					method.access |= Opcodes.ACC_SYNCHRONIZED;
				}
				return clazz;
			}
		},
		*/
		"WorldRenderer modify updateChunks": {
			"target": {
				"type": "METHOD",
				"class": "net.minecraft.client.renderer.WorldRenderer",
				"methodName": "func_174967_a", // updateChunks func_174967_a
				"methodDesc": "(J)V"
			},
			"transformer": function (method) {
				return method;
				printInstructions(method.instructions);
				print(method.instructions.size());
				var toInject = new InsnList();
				for (var i = 0; i <= 97; i++) {
					toInject.add(method.instructions.get(i));
				}
				//toInject.add(new InsnNode(RETURN));
				toInject.add(new LdcInsnNode(0));
				toInject.add(new LdcInsnNode(1));
				for (var i = 100; i < method.instructions.size(); i++) {
                	toInject.add(method.instructions.get(i));
                }
				print("done, clearing");
				method.instructions.clear();
				print("adding");
				method.instructions.add(toInject);
				//print("printing " + method.instructions.size());
				//printInstructions(method.instructions);
				print("done!");
				return method;
			}
		}
	};
}

/**
 * Util function to print a list of instructions for debugging
 *
 * @param {InsnList} instructions The list of instructions to print
 */
function printInstructions(instructions) {
	var arrayLength = instructions.size();
	var labelNames = {
		length: 0
	};
	for (var i = 0; i < arrayLength; ++i) {
		var text = getInstructionText(instructions.get(i), labelNames);
		if (text.length > 0) // Some instructions are ignored
			print(text);
	}
}

/**
 * Util function to get the text for an instruction
 *
 * @param {AbstractInsnNode} instruction The instruction to generate text for
 * @param {Map<int, string>} labelNames The names of the labels in the format Map<LabelHashCode, LabelName>
 */
function getInstructionText(instruction, labelNames) {
	var out = "";
	if (instruction == null) {
		return "null!";
	}
	if (instruction.getType() != 8) // LABEL
		out += " "; // Nice formatting
	if (instruction.getOpcode() > 0) // Labels, Frames and LineNumbers don't have opcodes
		out += OPCODES[instruction.getOpcode()] + " ";
	switch (instruction.getType()) {
		default:
		case 0: // INSN
		break;
		case 1: // INT_INSN
			out += instruction.operand;
		break;
		case 2: // VAR_INSN
			out += instruction.var;
		break;
		case 3: // TYPE_INSN
			out += instruction.desc;
		break;
		case 4: // FIELD_INSN
			out += instruction.owner + "." + instruction.name + " " + instruction.desc;
		break;
		case 5: // METHOD_INSN
			out += instruction.owner + "." + instruction.name + " " + instruction.desc + " (" + instruction.itf + ")";
		break;
		case 6: // INVOKE_DYNAMIC_INSN
			out += instruction.name + " " + instruction.desc;
		break;
		case 7: // JUMP_INSN
			out += getLabelName(instruction.label, labelNames);
		break;
		case 8: // LABEL
			out += getLabelName(instruction.getLabel(), labelNames);
		break;
		case 9: // LDC_INSN
			out += instruction.cst;
		break;
		case 10: // IINC_INSN
			out += instruction.var + " " + instruction.incr;
		break;
		case 11: // TABLESWITCH_INSN
			out += instruction.min + " " + instruction.max;
			out += "\n";
			for (var i = 0; i < instruction.labels.length; ++i) {
			  out += "   " + (instruction.min + i) + ": ";
			  out += getLabelName(instruction.labels[i], labelNames);
			  out += "\n";
			}
			out += "   " + "default: " + getLabelName(instruction.dflt, labelNames);
		break;
		case 12: // LOOKUPSWITCH_INSN
			for (var i = 0; i < instruction.labels.length; ++i) {
			  out += "   " + instruction.keys[i] + ": ";
			  out += getLabelName(instruction.labels[i], labelNames);
			  out += "\n";
			}
			out += "   " + "default: " + getLabelName(instruction.dflt, labelNames);
		break;
		case 13: // MULTIANEWARRAY_INSN
			out += instruction.desc + " " + instruction.dims;
		break;
		case 14: // FRAME
			out += "FRAME";
			// Frames don't work because Nashhorn calls AbstractInsnNode#getType()
			// instead of accessing FrameNode#type for the code "instruction.type"
			// so there is no way to get the frame type of the FrameNode
		break;
		case 15: // LINENUMBER
			out += "LINENUMBER ";
			out += instruction.line + " " + getLabelName(instruction.start.getLabel(), labelNames);
		break;
	}
	return out;
}

/**
 * Util function to get the name for a LabelNode "instruction"
 *
 * @param {LabelNode} label The label to generate a name for
 * @param {Map<int, string>} labelNames The names of other labels in the format Map<LabelHashCode, LabelName>
 */
function getLabelName(label, labelNames) {
	var labelHashCode = label.hashCode();
	var labelName = labelNames[labelHashCode];
	if (labelName == undefined) {
		labelName = "L" + labelNames.length;
		labelNames[labelHashCode] = labelName;
		++labelNames.length;
	}
	return labelName;
}

/** The names of the Java Virtual Machine opcodes. */
OPCODES = [
	"NOP", // 0 (0x0)
	"ACONST_NULL", // 1 (0x1)
	"ICONST_M1", // 2 (0x2)
	"ICONST_0", // 3 (0x3)
	"ICONST_1", // 4 (0x4)
	"ICONST_2", // 5 (0x5)
	"ICONST_3", // 6 (0x6)
	"ICONST_4", // 7 (0x7)
	"ICONST_5", // 8 (0x8)
	"LCONST_0", // 9 (0x9)
	"LCONST_1", // 10 (0xa)
	"FCONST_0", // 11 (0xb)
	"FCONST_1", // 12 (0xc)
	"FCONST_2", // 13 (0xd)
	"DCONST_0", // 14 (0xe)
	"DCONST_1", // 15 (0xf)
	"BIPUSH", // 16 (0x10)
	"SIPUSH", // 17 (0x11)
	"LDC", // 18 (0x12)
	"LDC_W", // 19 (0x13)
	"LDC2_W", // 20 (0x14)
	"ILOAD", // 21 (0x15)
	"LLOAD", // 22 (0x16)
	"FLOAD", // 23 (0x17)
	"DLOAD", // 24 (0x18)
	"ALOAD", // 25 (0x19)
	"ILOAD_0", // 26 (0x1a)
	"ILOAD_1", // 27 (0x1b)
	"ILOAD_2", // 28 (0x1c)
	"ILOAD_3", // 29 (0x1d)
	"LLOAD_0", // 30 (0x1e)
	"LLOAD_1", // 31 (0x1f)
	"LLOAD_2", // 32 (0x20)
	"LLOAD_3", // 33 (0x21)
	"FLOAD_0", // 34 (0x22)
	"FLOAD_1", // 35 (0x23)
	"FLOAD_2", // 36 (0x24)
	"FLOAD_3", // 37 (0x25)
	"DLOAD_0", // 38 (0x26)
	"DLOAD_1", // 39 (0x27)
	"DLOAD_2", // 40 (0x28)
	"DLOAD_3", // 41 (0x29)
	"ALOAD_0", // 42 (0x2a)
	"ALOAD_1", // 43 (0x2b)
	"ALOAD_2", // 44 (0x2c)
	"ALOAD_3", // 45 (0x2d)
	"IALOAD", // 46 (0x2e)
	"LALOAD", // 47 (0x2f)
	"FALOAD", // 48 (0x30)
	"DALOAD", // 49 (0x31)
	"AALOAD", // 50 (0x32)
	"BALOAD", // 51 (0x33)
	"CALOAD", // 52 (0x34)
	"SALOAD", // 53 (0x35)
	"ISTORE", // 54 (0x36)
	"LSTORE", // 55 (0x37)
	"FSTORE", // 56 (0x38)
	"DSTORE", // 57 (0x39)
	"ASTORE", // 58 (0x3a)
	"ISTORE_0", // 59 (0x3b)
	"ISTORE_1", // 60 (0x3c)
	"ISTORE_2", // 61 (0x3d)
	"ISTORE_3", // 62 (0x3e)
	"LSTORE_0", // 63 (0x3f)
	"LSTORE_1", // 64 (0x40)
	"LSTORE_2", // 65 (0x41)
	"LSTORE_3", // 66 (0x42)
	"FSTORE_0", // 67 (0x43)
	"FSTORE_1", // 68 (0x44)
	"FSTORE_2", // 69 (0x45)
	"FSTORE_3", // 70 (0x46)
	"DSTORE_0", // 71 (0x47)
	"DSTORE_1", // 72 (0x48)
	"DSTORE_2", // 73 (0x49)
	"DSTORE_3", // 74 (0x4a)
	"ASTORE_0", // 75 (0x4b)
	"ASTORE_1", // 76 (0x4c)
	"ASTORE_2", // 77 (0x4d)
	"ASTORE_3", // 78 (0x4e)
	"IASTORE", // 79 (0x4f)
	"LASTORE", // 80 (0x50)
	"FASTORE", // 81 (0x51)
	"DASTORE", // 82 (0x52)
	"AASTORE", // 83 (0x53)
	"BASTORE", // 84 (0x54)
	"CASTORE", // 85 (0x55)
	"SASTORE", // 86 (0x56)
	"POP", // 87 (0x57)
	"POP2", // 88 (0x58)
	"DUP", // 89 (0x59)
	"DUP_X1", // 90 (0x5a)
	"DUP_X2", // 91 (0x5b)
	"DUP2", // 92 (0x5c)
	"DUP2_X1", // 93 (0x5d)
	"DUP2_X2", // 94 (0x5e)
	"SWAP", // 95 (0x5f)
	"IADD", // 96 (0x60)
	"LADD", // 97 (0x61)
	"FADD", // 98 (0x62)
	"DADD", // 99 (0x63)
	"ISUB", // 100 (0x64)
	"LSUB", // 101 (0x65)
	"FSUB", // 102 (0x66)
	"DSUB", // 103 (0x67)
	"IMUL", // 104 (0x68)
	"LMUL", // 105 (0x69)
	"FMUL", // 106 (0x6a)
	"DMUL", // 107 (0x6b)
	"IDIV", // 108 (0x6c)
	"LDIV", // 109 (0x6d)
	"FDIV", // 110 (0x6e)
	"DDIV", // 111 (0x6f)
	"IREM", // 112 (0x70)
	"LREM", // 113 (0x71)
	"FREM", // 114 (0x72)
	"DREM", // 115 (0x73)
	"INEG", // 116 (0x74)
	"LNEG", // 117 (0x75)
	"FNEG", // 118 (0x76)
	"DNEG", // 119 (0x77)
	"ISHL", // 120 (0x78)
	"LSHL", // 121 (0x79)
	"ISHR", // 122 (0x7a)
	"LSHR", // 123 (0x7b)
	"IUSHR", // 124 (0x7c)
	"LUSHR", // 125 (0x7d)
	"IAND", // 126 (0x7e)
	"LAND", // 127 (0x7f)
	"IOR", // 128 (0x80)
	"LOR", // 129 (0x81)
	"IXOR", // 130 (0x82)
	"LXOR", // 131 (0x83)
	"IINC", // 132 (0x84)
	"I2L", // 133 (0x85)
	"I2F", // 134 (0x86)
	"I2D", // 135 (0x87)
	"L2I", // 136 (0x88)
	"L2F", // 137 (0x89)
	"L2D", // 138 (0x8a)
	"F2I", // 139 (0x8b)
	"F2L", // 140 (0x8c)
	"F2D", // 141 (0x8d)
	"D2I", // 142 (0x8e)
	"D2L", // 143 (0x8f)
	"D2F", // 144 (0x90)
	"I2B", // 145 (0x91)
	"I2C", // 146 (0x92)
	"I2S", // 147 (0x93)
	"LCMP", // 148 (0x94)
	"FCMPL", // 149 (0x95)
	"FCMPG", // 150 (0x96)
	"DCMPL", // 151 (0x97)
	"DCMPG", // 152 (0x98)
	"IFEQ", // 153 (0x99)
	"IFNE", // 154 (0x9a)
	"IFLT", // 155 (0x9b)
	"IFGE", // 156 (0x9c)
	"IFGT", // 157 (0x9d)
	"IFLE", // 158 (0x9e)
	"IF_ICMPEQ", // 159 (0x9f)
	"IF_ICMPNE", // 160 (0xa0)
	"IF_ICMPLT", // 161 (0xa1)
	"IF_ICMPGE", // 162 (0xa2)
	"IF_ICMPGT", // 163 (0xa3)
	"IF_ICMPLE", // 164 (0xa4)
	"IF_ACMPEQ", // 165 (0xa5)
	"IF_ACMPNE", // 166 (0xa6)
	"GOTO", // 167 (0xa7)
	"JSR", // 168 (0xa8)
	"RET", // 169 (0xa9)
	"TABLESWITCH", // 170 (0xaa)
	"LOOKUPSWITCH", // 171 (0xab)
	"IRETURN", // 172 (0xac)
	"LRETURN", // 173 (0xad)
	"FRETURN", // 174 (0xae)
	"DRETURN", // 175 (0xaf)
	"ARETURN", // 176 (0xb0)
	"RETURN", // 177 (0xb1)
	"GETSTATIC", // 178 (0xb2)
	"PUTSTATIC", // 179 (0xb3)
	"GETFIELD", // 180 (0xb4)
	"PUTFIELD", // 181 (0xb5)
	"INVOKEVIRTUAL", // 182 (0xb6)
	"INVOKESPECIAL", // 183 (0xb7)
	"INVOKESTATIC", // 184 (0xb8)
	"INVOKEINTERFACE", // 185 (0xb9)
	"INVOKEDYNAMIC", // 186 (0xba)
	"NEW", // 187 (0xbb)
	"NEWARRAY", // 188 (0xbc)
	"ANEWARRAY", // 189 (0xbd)
	"ARRAYLENGTH", // 190 (0xbe)
	"ATHROW", // 191 (0xbf)
	"CHECKCAST", // 192 (0xc0)
	"INSTANCEOF", // 193 (0xc1)
	"MONITORENTER", // 194 (0xc2)
	"MONITOREXIT", // 195 (0xc3)
	"WIDE", // 196 (0xc4)
	"MULTIANEWARRAY", // 197 (0xc5)
	"IFNULL", // 198 (0xc6)
	"IFNONNULL" // 199 (0xc7)
];
