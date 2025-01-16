import {Translation} from "../domain/Translation";
import {Lang} from "../domain/Lang";


export class TranslatorService {

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

  public static async getAllLang(): Promise<Lang[]> {
    const res = await fetch("http://localhost:5000/languages", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

    return await res.json();
  }
}