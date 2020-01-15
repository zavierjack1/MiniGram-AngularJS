import { Component, EventEmitter, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { NgForm, FormControl } from '@angular/forms';
import { PostService } from '../post.service';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
    postService: PostService;
    constructor(postService: PostService){
        this.postService = postService;
    }

    onAddPost(form: NgForm){
        if (form.invalid) return;
        
        const post: Post = {
            title: form.value.title,
            content: form.value.content
        }

        this.postService.addPost(post);
        form.resetForm();
    }  

    getTitleError(){
        return "You've entered a bad message";
    }
}

