import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Products from './Products';

export default function Search() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q');

  useEffect(() => {
    if (!query) {
      navigate('/products');
    }
  }, [query, navigate]);

  return <Products />;
}
