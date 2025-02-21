import { useRef, useState, useCallback } from 'react';
import { roundOff } from './roundOff';

const useInfiniteScroll = (next) => {
  const listInnerRef = useRef();
  const [postsPerPage, setPostsPerPage] = useState(20);

  const scrollToEnd = () => {
    setPostsPerPage((prev) => prev + 10);
  };

  const handleScroll = useCallback((event) => {
    if (
      roundOff(
        event.currentTarget.scrollTop + event.currentTarget.offsetHeight,
        0
      ) === roundOff(event.currentTarget.scrollHeight)
    ) {
      if (next) {
        scrollToEnd();
      }
    }
  }, [next]);

  return { handleScroll, listInnerRef, postsPerPage };
};

export default useInfiniteScroll;