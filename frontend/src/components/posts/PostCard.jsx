import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function PostCard({ post }) {
  return (
    <div style={{ background: '#1a1a2e', borderRadius: '8px', padding: '1.5rem', border: '1px solid #2a2a3e' }}>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        {post.tags?.map((tag) => (
          <span key={tag} style={{ background: '#2a2a3e', color: '#aaa', padding: '0.15rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem' }}>
            {tag}
          </span>
        ))}
      </div>
      <h2 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', lineHeight: 1.4 }}>
        <Link to={`/posts/${post._id}`} style={{ color: '#fff', textDecoration: 'none' }}>
          {post.title}
        </Link>
      </h2>
      <p style={{ color: '#888', fontSize: '0.875rem', marginBottom: '1rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
        {post.content}
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#666' }}>
        <span>By {post.author?.name}</span>
        <span>{format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
      </div>
    </div>
  );
}
