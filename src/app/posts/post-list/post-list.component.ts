import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['/post-list.component.css']
})
export class PostListComponent{
    @Input() posts = []; //input means it can bind to variables from the parent component
 
    
    // posts = [
    //     {title: "first post", content: "esta es mi post primero"},
    //     {title: "second post", content: "esta es mi post segundo"},
    //     {title: "third post", content: "esta es mi post trecer"}
    // ]
    
}