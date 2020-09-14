import { UrlPath } from "../core/util_url_path"
import { PostListItem, PostList } from "./posts_index_client"

const TOTAL_COUNT = 25

export const processPostsIndexGetAction = async (path: UrlPath): Promise<PostList> => {
  const pageNumber = +(path.query?.page ?? 1) - 1
  return {
    pageNumber: pageNumber,
    totalCount: TOTAL_COUNT,
    items: generateDummyItems(),
  }
}

const generateDummyItems = (): PostListItem[] => {
  const items: PostListItem[] = []
  for (let i = 0; i < TOTAL_COUNT; i++) {
    items.push({
      postId: i + 1,
      title: `記事 #${i + 1}`,
      author: "未詳",
    })
  }
  return items
}
