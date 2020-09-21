import { AuthorNamePipe } from './author-name.pipe';

describe('AuthorNamePipe', () => {
  it('create an instance', () => {
    const pipe = new AuthorNamePipe();
    expect(pipe).toBeTruthy();
  });
});
