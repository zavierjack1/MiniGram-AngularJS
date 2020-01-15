import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { NgForm, FormControl } from '@angular/forms';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent{

    @Output() postCreated = new EventEmitter<Post>();

    onAddPost(form: NgForm){
        if (form.invalid) return;
        
        const post: Post = {
            title: form.value.title,
            content: form.value.content
        }

        console.log(post.title)

        this.postCreated.emit(post);
    }  
    getTitleError(){
        return "You've entered a bad message";
    }
}

