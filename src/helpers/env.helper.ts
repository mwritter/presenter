import { Command } from "@tauri-apps/api/shell";

export const readEnvVariable = async (
  variableName: string
): Promise<string> => {
  const commandResult = await new Command(
    "get-env-variable",
    variableName
  ).execute();
  if (commandResult.code !== 0) {
    throw new Error(commandResult.stderr);
  }

  return commandResult.stdout;
};
