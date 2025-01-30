declare module 'mapshaper' {
    export interface MapshaperOptions {
      [key: string]: string | number | boolean | object; // Options for mapshaper commands
    }
  
    export interface MapshaperOutput {
      [filename: string]: string | ArrayBuffer; // Supports multiple file outputs
    }
  
    export function applyCommands(
      commands: string,
      inputs: { [filename: string]: string | ArrayBuffer },
      opts?: MapshaperOptions
    ): Promise<MapshaperOutput>;
  
    const mapshaper: {
      applyCommands: typeof applyCommands;
    };
  
    export default mapshaper;
  }
  