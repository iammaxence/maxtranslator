import {TranslatorService} from "../translatorService";

describe('TranslatorService', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  })

  describe('translation', () => {
    it('should call the correct API endpoint and return the translation', async () => {
      // Given
      const mockResponse = { translatedText: "Bonjour" };
      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));
      const text = "Hello";
      const langSrc = "en";
      const langTarget = "fr";

      // When
      const result = await TranslatorService.translation(text, langSrc, langTarget);

      // Then
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith("http://localhost:5000/translate", {
        method: "POST",
        body: JSON.stringify({
          q: text,
          source: langSrc,
          target: langTarget,
        }),
        headers: { "Content-Type": "application/json" },
      });
      expect(result).toEqual(mockResponse);
    });

    it('should default to auto source language and French target language', async () => {
      // Given
      const mockResponse = { translatedText: "Bonjour" };
      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));
      const text = "Hello";

      // When
      const result = await TranslatorService.translation(text);

      // Then
      expect(fetch).toHaveBeenCalledWith("http://localhost:5000/translate", {
        method: "POST",
        body: JSON.stringify({
          q: text,
          source: "auto",
          target: "fr",
        }),
        headers: { "Content-Type": "application/json" },
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error if the fetch fails', async () => {
      // Given + When
      fetchMock.mockReject(new Error('Network error'));

      // Then
      await expect(TranslatorService.translation("Hello")).rejects.toThrow('Network error');
    });
  })

  describe('languages', () => {
    it('should call the correct API endpoint and return all languages', async () => {
      // Given
      const mockResponse = [{ code: 'FR', name: 'French', targets: ['en'] }];
      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      // When
      const result = await TranslatorService.getAllLang();

      // Then
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith("http://localhost:5000/languages", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      expect(result).toEqual(mockResponse);
    })

    it('should throw an error if the fetch fails', async () => {
      // Given + When
      fetchMock.mockReject(new Error('Network error'));

      // Then
      await expect(TranslatorService.getAllLang()).rejects.toThrow('Network error');
    });
  })
});
