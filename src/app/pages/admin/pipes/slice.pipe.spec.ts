import { SlicePipe } from './slice.pipe';

describe('SlicePipe', () => {
  let pipe: SlicePipe;

    beforeEach( () => {
        pipe = new SlicePipe();
    });
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
  it('slice-pipe', () => {
    const text = 'Hello this is a test to check the pipe';
    const newText = pipe.transform(text, 0, 5);
    expect(newText.length).toBe(5);
});
});
