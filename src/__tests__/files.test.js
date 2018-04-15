import { getTypenameForFile, optimisticFileResponse } from '../files';

describe('files', () => {
  describe('getTypenameForFile', () => {
    it('returns the typename for a file given a content-type', () => {
      expect(getTypenameForFile({ contentType: 'image/jpeg' })).toEqual(
        'Image',
      );
      expect(getTypenameForFile({ contentType: 'audio/mp3' })).toEqual('Audio');
      expect(getTypenameForFile({ contentType: 'video/mp4' })).toEqual('Video');
    });

    it('returns GenericFile for content-types it does not recognize', () => {
      expect(
        getTypenameForFile({ contentType: 'application/octet-stream' }),
      ).toEqual('GenericFile');
      expect(getTypenameForFile({ contentType: 'application/zip' })).toEqual(
        'GenericFile',
      );
      expect(getTypenameForFile({ contentType: 'text/plain' })).toEqual(
        'GenericFile',
      );
    });
  });

  describe('optimisticFileResponse', () => {
    it("returns original file if it doesn't have a name", () => {
      const file = { extra: 'file://xxx' };

      expect(optimisticFileResponse(file)).toBe(file);
    });

    it('returns original file if URL is not remote', () => {
      const file = { name: 'foo.jpg', url: 'http://example.com/foo.jpg' };
      expect(optimisticFileResponse(file)).toBe(file);
    });

    it('returns an optimistic response shape for a file', () => {
      expect(
        optimisticFileResponse({
          name: 'foo.jpg',
          url: 'file://foo.jpg',
          contentType: 'image/jpeg',
          size: 2000,
        }),
      ).toMatchSnapshot();
    });
  });
});
