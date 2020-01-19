import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['/post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy{
    postService: PostService;
    private postsSubscription: Subscription;

    constructor(postService: PostService){
        this.postService = postService;
    }

    posts: Post[] = []; //input means it can bind to variables from the parent component

    ngOnInit(): void {
        this.postService.getPosts();
        this.postsSubscription = this.postService.getPostUpdatedListener()
            .subscribe((posts: Post[]) =>{
                this.posts = posts;
            }) ;
    }

    ngOnDestroy(): void {
        this.postsSubscription.unsubscribe();
    }

    onDelete(postId: String){ 
        this.postService.deletePost(postId);
    }
}