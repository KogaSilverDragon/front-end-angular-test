import {browser, by, element, protractor} from 'protractor';

export class AppPage {
  private EC = protractor.ExpectedConditions;
  navigateTo() {
    return browser.get('/');
  }

  maximizeWindow() {
    browser.driver.manage().window().maximize();
  }

  getUserListHeader() {
    return element(by.css('user-list h2')).getText();
  }

  getUserInfoHeader() {
    return element(by.css('user-info h2')).getText();
  }

  getTableUserCheckbox(id: number) {
    let el = element(by.css(`user-list .table-container .custom-checkbox[for="select-${id}"]`));
    browser.wait(this.EC.visibilityOf(el), 5000);
    return el;
  }

  getTableUserFullname(id: number) {
    let el = element(by.css(`user-list .table-container #user-row-${id} .user-full-name`));
    browser.wait(this.EC.visibilityOf(el), 5000);
    return el.getText();
  }

  isTableUserSelected(id: number) {
    return element(by.css(`user-list #select-${id}`)).getAttribute('value');
  }

  viewUser(id: number) {
    let el = element(by.css(`user-list .table-container #view-${id}`));
    browser.wait(this.EC.visibilityOf(el), 5000);
    el.click();
  }

  editUser() {
    let el = element(by.css(`user-info #user-edit`));
    browser.wait(this.EC.visibilityOf(el), 5000);
    el.click();
  }

  setFirstName(firstname: string) {
    let el = element(by.css(`user-info #firstname`));
    browser.wait(this.EC.visibilityOf(el), 5000);
    el.clear();
    el.sendKeys(firstname);
  }

  setLastName(lastname: string) {
    let el = element(by.css(`user-info #lastname`));
    browser.wait(this.EC.visibilityOf(el), 5000);
    el.clear();
    el.sendKeys(lastname);
  }

  saveUser() {
    let el = element(by.css(`user-info #user-save`));
    browser.wait(this.EC.visibilityOf(el), 5000);
    el.click();
  }

  confirmSaveUser() {
    let el = element(by.css(`.user-info--confirm-modal #user-confirm-save`));
    browser.wait(this.EC.visibilityOf(el), 5000);
    el.click();
  }

  cancelSaveUser() {
    let el = element(by.css(`.user-info--confirm-modal #user-cancel-save`));
    browser.wait(this.EC.visibilityOf(el), 5000);
    el.click();
  }

  goBackToUserList() {
    let el = element(by.css(`user-info #user-back`));
    browser.wait(this.EC.visibilityOf(el), 5000);
    el.click();
  }
}
