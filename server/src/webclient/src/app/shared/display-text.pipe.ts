import { Pipe, PipeTransform } from '@angular/core';

const urlRegex =
  /(https?|ftp|file):\/\/(-\.)?([^\s/?.#'"()[\]]+\.?)+(\/[^\s'"]*)?/gi;

export type TextSegment = { link: boolean; text: string; newline: boolean };

@Pipe({
  name: 'displayText',
})
export class DisplayTextPipe implements PipeTransform {
  /**
   * Transform raw text to lines and links
   */
  transform(text: string): TextSegment[] {
    const segs = text.split('\n').flatMap((line) => {
      const segments: TextSegment[] = [];
      const empty = { link: false, text: '', newline: false } as TextSegment;
      let startIndex = 0;
      for (const m of line.matchAll(urlRegex)) {
        const ind = m.index ?? -1;
        if (ind > startIndex) {
          segments.push({
            ...empty,
            text: line.substring(startIndex, m.index),
          });
        }
        segments.push({ ...empty, link: true, text: m[0] });
        startIndex = ind + m[0].length;
      }
      if (startIndex < line.length || line.length === 0) {
        segments.push({
          ...empty,
          text: line.substring(startIndex),
        });
      }
      segments[segments.length - 1].newline = true;
      return segments;
    });
    // if last line is blank, it should be a new line
    segs[segs.length - 1].newline = segs[segs.length - 1].text === '';
    return segs;
  }
}
