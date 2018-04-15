// @flow
import {
  always,
  // $FlowFixMe$
  compose,
  cond,
  last,
  memoize,
  merge,
  prop,
  startsWith,
  T,
} from 'ramda';
import mime from 'mime/lite';

const getContentTypeFromExtension = memoize((extension: string) => {
  return mime.getType(extension);
});

/**
 * Return a content type from a filename, uses `mime`.
 *
 * @param filename
 * @returns {string} ContentType
 */
export const getContentTypeFromFilename = (filename: string) => {
  // $FlowFixMe$
  return getContentTypeFromExtension(last(filename.split('.')));
};

/**
 * Convert a content-type to a valid GraphQL scbema type
 *
 * @param file
 * @returns {string} Image, Video, Audio if content type matches, GenericFile otherwise
 */
export const getTypenameForFile = (file: { contentType: string }) => {
  return compose(
    // $FlowFixMe$
    cond([
      [startsWith('image'), always('Image')],
      [startsWith('video'), always('Video')],
      [startsWith('audio'), always('Audio')],
      [T, always('GenericFile')],
    ]),
    prop('contentType'),
  )(file);
};

export const optimisticFileResponse = (file: {
  contentType: string,
  name: string,
  url: string,
}) => {
  if (!file.name) {
    return file;
  }

  const isLocal = !file.url.startsWith('http');

  if (!isLocal) {
    return file;
  }

  const contentType = getContentTypeFromFilename(file.name);

  return merge(
    {
      contentType,
      __typename: getTypenameForFile({ contentType }),
    },
    file,
  );
};
