import { Component, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { NgForm, FormControl } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

enum Mode {
    CREATE,
    EDIT
}

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit{
    constructor(public postService: PostService, public route: ActivatedRoute){}
    public post: Post; //needs to be public so we can get it in the html
    private mode; //create mode or edit mode
    private postId: string; 
    private isLoading = false;

    ngOnInit(): void {
        this.route.paramMap.subscribe((paramMap: ParamMap)=>{
            if (paramMap.has('postId')){
                this.mode = Mode.EDIT;
                this.postId = paramMap.get('postId');
                this.isLoading = true;
                this.postService.getPost(this.postId).subscribe(postData=>{
                    this.post = {
                        id: postData._id,
                        title: postData.title,
                        content: postData.content
                    };
                    this.isLoading = false;
                });
            }
            else{
                this.mode = Mode.CREATE;
                this.postId = null;
            }
        });
    }

    onSavePost(form: NgForm){
        if (form.invalid) return;
        this.isLoading = true;//no need to set back to false because we're leaving page and when we come back we set back to false
        if (this.mode === Mode.CREATE) {
            const post: Post = {
                id: null,
                title: form.value.title,
                content: form.value.content
            }
            this.postService.addPost(post);
        }
        else if (this.mode === Mode.EDIT){
            this.postService.updatePost({
                id: this.postId,
                title: form.value.title,
                content: form.value.content
            });
        }
        form.resetForm();
    }  

    getTitleError(){
        return "You've entered a bad message";
    }
}

