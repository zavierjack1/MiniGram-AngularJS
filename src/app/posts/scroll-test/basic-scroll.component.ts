import { Component } from '@angular/core';
import * as faker from 'faker';
 
@Component({
    selector: "basic-scroll",
    templateUrl: "./basic-scroll.component.html",
    styleUrls: ["./basic-scroll.component.css"]
})

export class BasicScrollComponent{
    people;
    constructor(){
        this.people = Array(100).fill(1).map(_ =>{
            return {
                name: faker.name.findName(),
                bio: faker.hacker.phrase()
            }
        });

        console.log(this.people);
    }
}

 