import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../common/Input';
import Button from '../common/Button';

// Single form component used for both create and edit
export default function PostEditor({ initialData, onSubmit, loading }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        content: initialData.content,
        tags: initialData.tags?.join(', '),
        status: initialData.status,
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      tags: data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    });
  };

  const textareaStyle = {
    width: '100%',
    padding: '0.65rem 0.75rem',
    background: '#1a1a2e',
    border: `1px solid ${errors.content ? '#e94560' : '#444'}`,
    borderRadius: '4px',
    color: '#fff',
    fontSize: '0.95rem',
    boxSizing: 'border-box',
    outline: 'none',
    minHeight: '250px',
    resize: 'vertical',
    marginBottom: errors.content ? '0' : '1rem',
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Input
        label="Title *"
        placeholder="Post title..."
        error={errors.title?.message}
        {...register('title', { required: 'Title is required', minLength: { value: 3, message: 'Min 3 characters' } })}
      />
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.35rem', color: '#aaa', fontSize: '0.9rem' }}>Content *</label>
        <textarea style={textareaStyle} placeholder="Write your post content..." {...register('content', { required: 'Content is required', minLength: { value: 10, message: 'Min 10 characters' } })} />
        {errors.content && <p style={{ color: '#e94560', margin: '0.25rem 0 1rem', fontSize: '0.82rem' }}>{errors.content.message}</p>}
      </div>
      <Input
        label="Tags (comma separated)"
        placeholder="react, javascript, tutorial"
        {...register('tags')}
      />
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.35rem', color: '#aaa', fontSize: '0.9rem' }}>Status</label>
        <select
          style={{ width: '100%', padding: '0.65rem 0.75rem', background: '#1a1a2e', border: '1px solid #444', borderRadius: '4px', color: '#fff', fontSize: '0.95rem', boxSizing: 'border-box' }}
          {...register('status')}
          defaultValue="draft"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : initialData ? 'Update Post' : 'Create Post'}</Button>
        <Button type="button" variant="secondary" onClick={() => window.history.back()}>Cancel</Button>
      </div>
    </form>
  );
}
