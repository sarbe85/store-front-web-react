import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Products from './Products';

export default function CategoryProducts() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!slug) {
      navigate('/categories');
    }
  }, [slug, navigate]);

  return <Products />;
}
