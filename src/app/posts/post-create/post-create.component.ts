import { Component, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';

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
    post: Post; //needs to be public so we can get it in the html
    isLoading = false;
    form: FormGroup;
    imagePreview: string;
    private postId: string; 
    private mode: Number; //create mode or edit mode

    constructor(public postService: PostService, public route: ActivatedRoute){}

    ngOnInit(): void {
        this.form = new FormGroup({
            title: new FormControl(
                null, 
                {validators: [Validators.required, Validators.minLength(3)]}, 
            ), 
            content: new FormControl(
                null, 
                {validators: [Validators.required]}
            ),
            image: new FormControl(
                null, 
                {validators: [Validators.required],
                asyncValidators: [mimeType]}
            )
        });
        this.route.paramMap.subscribe((paramMap: ParamMap)=>{
            if (paramMap.has('postId')){
                this.mode = Mode.EDIT;
                this.postId = paramMap.get('postId');
                this.isLoading = true;
                this.postService.getPost(this.postId).subscribe(postData=>{
                    this.post = {
                        id: postData._id,
                        title: postData.title,
                        content: postData.content,
                        imagePath: postData.imagePath
                    };
                    this.isLoading = false;

                    this.form.setValue(
                        {
                            title: this.post.title,
                            content: this.post.content,
                            image: this.post.imagePath
                        }
                    )
                });
            }
            else{
                this.mode = Mode.CREATE;
                this.postId = null;
            }
        });
    }

    onSavePost(){
        if (this.form.invalid) return;
        this.isLoading = true;//no need to set back to false because we're leaving page and when we come back we set back to false
        if (this.mode === Mode.CREATE) {
            this.postService.addPost(
                this.form.value.title, 
                this.form.value.content, 
                this.form.value.image
            );
        }
        else if (this.mode === Mode.EDIT){
            this.postService.updatePost(
                this.postId,
                this.form.value.title,
                this.form.value.content,
                this.form.value.image
            );
        }
        this.form.reset();
    }  

    onImagePicked(event: Event){
        const file = (event.target as HTMLInputElement).files[0];
        this.form.patchValue({image: file});
        this.form.get('image').updateValueAndValidity();
        console.log(file);
        console.log(this.form);
        const reader = new FileReader();
        reader.onload =() => {
            this.imagePreview = reader.result as string;
        };
        reader.readAsDataURL(file);
    }

    getTitleError(){
        return "You've entered a bad message";
    }

    
}

