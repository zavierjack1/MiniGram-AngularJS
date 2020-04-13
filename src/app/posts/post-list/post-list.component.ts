import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy{
    totalPosts = 0;
    postsPerPage = 2;
    pageSizeOptions = [1,2,5,10];
    currentPage = 1;
    posts: Post[] = [];
    userId: string;
    //userIsAdmin: boolean;
    public userIsAuthenticated = false;
    private authStatusSub: Subscription;
    private postsSub: Subscription;
    public isLoading = false;

    constructor(public postService: PostService, private authService:AuthService){}

    onChangedPage(pageData: PageEvent){
        this.isLoading = true;
        this.currentPage = pageData.pageIndex + 1; //keep in mind, pageIndex starts at 0 so we add 1
        this.postsPerPage = pageData.pageSize;
        this.postService.getPosts(this.postsPerPage, this.currentPage);
    }
    
    ngOnInit(): void {
        this.isLoading = true;
        this.userId = this.authService.getUserId();
        this.postsSub = this.postService.getPostUpdatedListener()
            .subscribe((postData: {posts: Post[], postCount: number}) =>{
                this.posts = postData.posts;
                this.totalPosts = postData.postCount;
                this.isLoading = false;
            });
        this.postService.getPosts(this.postsPerPage, this.currentPage);

        this.userIsAuthenticated = this.authService.getIsAuthenticated();
        //setup user subscription
        this.authStatusSub = this.authService
            .getAuthStatusListener()
            .subscribe(isAuthenticated => {
                this.userIsAuthenticated = isAuthenticated;
                this.userId = this.authService.getUserId();
            });
    }

    ngOnDestroy(): void {
        this.postsSub.unsubscribe();
        this.authStatusSub.unsubscribe();
    }

    onDelete(postId: string){ 
        this.isLoading = true;
        this.postService.deletePost(postId).subscribe(() => {
            this.postService.getPosts(this.postsPerPage, this.currentPage);
        },
        error => {
            this.isLoading = false;
        });
    }
}