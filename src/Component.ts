import Crypto from "crypto";
export class Component {
  public id: string;

  constructor(public name: string, public definedIn: string) {
    this.id = Crypto.randomUUID();
  }
}
