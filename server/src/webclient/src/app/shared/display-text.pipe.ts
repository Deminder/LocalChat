import { Pipe, PipeTransform } from '@angular/core';

const urlRegex = /(https?|ftp|file):\/\/(-\.)?([^\s/?\.#'"()\[\]]+\.?)+(\/[^\s'"]*)?/gi;

@Pipe({
  name: 'displayText',
})
export class DisplayTextPipe implements PipeTransform {
  /**
   * Transform raw text to lines and links
   */
  transform(text: string): { link: boolean; text: string; newline: boolean }[] {
    const segs = text.split('\n').flatMap((line) => {
      const segments = [];
      let startIndex = 0;
      for (const m of line.matchAll(urlRegex)) {
        if (m.index > startIndex) {
          segments.push({
            link: false,
            text: line.substring(startIndex, m.index),
          });
        }
        segments.push({ link: true, text: m[0] });
        startIndex = m.index + m[0].length;
      }
      if (startIndex < line.length || line.length === 0) {
        segments.push({
          link: false,
          text: line.substring(startIndex),
        });
      }
      segments[segments.length - 1].newline = true;
      return segments;
    });
    // if last line is blank, it should be a new line
    segs[segs.length - 1].newline = segs[segs.length - 1] === '';
    return segs;
  }
}
