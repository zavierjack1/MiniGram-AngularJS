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
    postsPerPage = 5;
    pageSizeOptions = [1,2,5,10];
    currentPage = 1;
    posts: Post[] = []; 
    userId: string;
    userData: {userId: string, email: string, admin: boolean}; 
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
        this.userData = this.authService.getUserData();
        
        this.postsSub = this.postService.getPostUpdatedListener()
            .subscribe((postData: {posts: Post[], postCount: number}) =>{
                this.posts = postData.posts;
                console.log(this.posts);
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
                this.userData = this.authService.getUserData();
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
    
    onLike(postId: string): void{
        let userLikedPost: boolean;
        if (this.posts.find(post => {return post.id == postId}).likedBy.includes(this.userData.userId)){
            userLikedPost = true;
        } 
        else{
            userLikedPost = false;
        }
        this.postService.likePost(postId, !userLikedPost).subscribe((res) => {
            //if the user didnt like this post, then we are LIKING the post, add user to likedBy
            if (!userLikedPost){
                //in-memory add this user to the liked by array or remove user from liked by array
                let likedPost = this.posts.find(post => {
                    return post.id == postId
                });  
 
                likedPost.likedBy.push(this.userData.userId);
            }
            //if the user did like the post, then we are UNLIKING the post, remove the user from likeBy
            else{
                let likedPost = this.posts.find(post => {
                    return post.id == postId
                });  
    
                likedPost.likedBy = likedPost.likedBy.filter(userId => {
                    return userId != this.userData.userId;
                });
            }
        }, 
        error =>{
            console.log("error onLike: "+error);
        }); 
    }
}
