import { AppPage } from './app.po';

describe('front-end-angular-test App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should edit the first user and check if it\'s updated', () => {
    page.maximizeWindow();
    page.navigateTo();
    expect(page.getUserListHeader()).toEqual('User list');
    page.getTableUserCheckbox(1).click();
    expect(page.isTableUserSelected(1).valueOf()).toBeTruthy();
    expect(page.getTableUserFullname(1)).toEqual('John Doe');

    page.viewUser(1);
    expect(page.getUserInfoHeader()).toEqual('User information');
    page.editUser();
    page.setFirstName('João');
    page.setLastName('Silva');
    page.saveUser();
    page.confirmSaveUser();
    page.goBackToUserList();
    expect(page.getTableUserFullname(1)).toEqual('João Silva');
  });
});
