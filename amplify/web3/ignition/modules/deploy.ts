import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DeployModule = buildModule("LawVoiceModule", (m) => {
  const lawVoice = m.contract("LawVoice");
  return { lawVoice };
});

export default DeployModule;