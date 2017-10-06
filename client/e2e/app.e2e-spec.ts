import { TennisAppPage } from './app.po';

describe('tennis-app App', () => {
  let page: TennisAppPage;

  beforeEach(() => {
    page = new TennisAppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
