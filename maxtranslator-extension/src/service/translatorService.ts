import {Translation} from "../domain/Translation";


export class TranslatorService {

  private constructor() {}

  public static async translation(text: string, langSrc: string = 'auto', langTarget: string = 'fr'): Promise<Translation> {
    const res = await fetch("http://localhost:5000/translate", {
      method: "POST",
      body: JSON.stringify({
        q: text,
        source: langSrc,
        target: langTarget,
      }),
      headers: { "Content-Type": "application/json" },
    });

    return await res.json();
  }
}