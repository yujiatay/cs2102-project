import { Article, Comment } from '../types/article';
import db from './db';

const ARTICLE_LIST_LIMIT = 20;
const COMMENT_LIST_LIMIT = 20;

/**
 * Adds a new article.
 */
export function addArticle(dusername: string, title: string, content: string): Promise<Article> {
  return db.getOne(`
    INSERT INTO Articles (username, title, content) VALUES ($1, $2, $3) RETURNING *
  `, [dusername, title, content]) as Promise<Article>;
}

/**
 * Adds a new comment.
 */
export function addComment(article: Article, username: string, content: string): Promise<Comment> {
  return db.getOne(`
    INSERT INTO Comments (ausername, acreated_at, username, content) VALUES ($1, $2, $3, $4) RETURNING *
  `, [article.username, new Date(article.createdAt), username, content]) as Promise<Comment>;
}

/**
 * Deletes the given article.
 */
export function deleteArticle(article: Article): Promise<{}> {
  return db.query(`
    DELETE FROM Articles WHERE username = $1 AND created_at = $2
  `, [article.username, new Date(article.createdAt)]);
}

/**
 * Deletes the given comment.
 */
export function deleteComment(comment: Comment): Promise<{}> {
  return db.query(`
    DELETE FROM Comments WHERE ausername = $1 AND acreated_at = $2 AND username = $3 AND created_at = $4
  `, [comment.ausername, new Date(comment.acreatedAt), comment.username, new Date(comment.createdAt)]);
}

/**
 * Gets the most recent comments by the given diner.
 */
export function getRecentCommentsByDiner(dusername: string, prev?: number): Promise<Comment[]> {
  return db.getAll(`
    SELECT * FROM Comments WHERE username = $1 AND created_at < $2 ORDER BY created_at DESC LIMIT ${COMMENT_LIST_LIMIT}
  `, [dusername, new Date(prev || Date.now())]);
}

/**
 * Gets the article with the given author and creation time.
 */
export function getArticle(dusername: string, createdAt: number): Promise<Article | null> {
  return db.getOne(`
    SELECT * FROM Articles WHERE username = $1 AND created_at = $2
  `, [dusername, new Date(createdAt)]);
}

/**
 * Gets the comment with the given article, author, and creation time.
 */
export function getComment(ausername: string, acreatedAt: number,
                           username: string, createdAt: number): Promise<Comment | null> {
  return db.getOne(`
    SELECT * FROM Comments WHERE ausername = $1 AND acreated_at = $2 AND username = $3 AND created_at = $4
  `, [ausername, new Date(acreatedAt), username, new Date(createdAt)]);
}

/**
 * Gets the most recent articles.
 */
export function getRecentArticles(prev?: number): Promise<Article[]> {
  return db.getAll(`
    SELECT * FROM Articles WHERE created_at < $1 ORDER BY created_at DESC LIMIT ${ARTICLE_LIST_LIMIT}
  `, [new Date(prev || Date.now())]);
}

/**
 * Gets the most recent articles by the given diner.
 */
export function getRecentArticlesByDiner(dusername: string, prev?: number): Promise<Article[]> {
  return db.getAll(`
    SELECT * FROM Articles WHERE username = $1 AND created_at < $2 ORDER BY created_at DESC LIMIT ${ARTICLE_LIST_LIMIT}
  `, [dusername, new Date(prev || Date.now())]);
}

/**
 * Gets the most recent comments on the given article.
 */
export function getRecentCommentsOnArticle(article: Article, prev?: number): Promise<Comment[]> {
  return db.getAll(`
    SELECT * FROM Comments WHERE ausername = $1 AND acreated_at = $2 AND created_at < $3
    ORDER BY created_at DESC LIMIT ${COMMENT_LIST_LIMIT}
  `, [article.username, new Date(article.createdAt), new Date(prev || Date.now())]);
}

/**
 * Updates the title and content of the given article.
 */
export function updateArticle(article: Article, title: string, content: string): Promise<Article | null> {
  return db.getOne(`
    UPDATE Articles SET (title, content, updated_at) = ($1, $2, NOW()) WHERE username = $3 AND created_at = $4 RETURNING *
  `, [title, content, article.username, new Date(article.createdAt)]);
}

/**
 * Updates the content of the given comment.
 */
export function updateComment(comment: Comment, content: string): Promise<Comment | null> {
  return db.getOne(`
    UPDATE Comments SET (content, updated_at) = ($1, NOW())
    WHERE ausername = $2 AND acreated_at = $3 AND username = $4 AND created_at = $5 RETURNING *
  `, [content, comment.ausername, new Date(comment.acreatedAt), comment.username, new Date(comment.createdAt)]);
}
