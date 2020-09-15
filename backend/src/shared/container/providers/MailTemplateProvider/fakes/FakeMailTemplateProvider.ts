import IMailTemplateProvider from "../models/IMailTemplateProvider";

class FakeMailTemplanteProvider implements IMailTemplateProvider {
  public async parse(): Promise<string> {
    return 'Mail Content';
  }
}

export default FakeMailTemplanteProvider;