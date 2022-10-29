import { Address } from "./Address";
import { StudentHelper } from "./StudentHelper";

export class Student {
    name: string;
    address: Address;
    helper: StudentHelper;

    constructor(name: string, address: Address, helper: StudentHelper) {
        this.name = name;
        this.address = address;
        this.helper = helper;
    }

    helpMe() {
        this.helper.help();
    }

    getAddress() {
        return this.address;
    }

}
