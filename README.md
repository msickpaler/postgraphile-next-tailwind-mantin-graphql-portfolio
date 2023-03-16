# ポートフォリオ

## 使用技術

- next.js
- tailwind
- mantine
- Ant Design Charts
- postgraphile
- graphQL
- graphql-codegen
- firebase auth

## ページ一覧

- インデックスページ(ISR)
  - [実際のページ](https://postgraphile-next-tailwind-mantin-graphql-portfolio.vercel.app/)
  - [ソースコード](https://github.com/msickpaler/postgraphile-next-tailwind-mantin-graphql-portfolio/blob/master/nextjs/src/pages/index.tsx)
- 新規登録ページ(SSG)
  - [実際のページ](https://postgraphile-next-tailwind-mantin-graphql-portfolio.vercel.app/signup)
  - [ソースコード](https://github.com/msickpaler/postgraphile-next-tailwind-mantin-graphql-portfolio/blob/master/nextjs/src/pages/signup/index.tsx)
- ログインページ(SSG)
  - [実際のページ](https://postgraphile-next-tailwind-mantin-graphql-portfolio.vercel.app/signin)
  - [ソースコード](https://github.com/msickpaler/postgraphile-next-tailwind-mantin-graphql-portfolio/blob/master/nextjs/src/pages/signin/index.tsx)
- ユーザー削除ページ(SSG)
  - [実際のページ](https://postgraphile-next-tailwind-mantin-graphql-portfolio.vercel.app/delete-user)
  - [ソースコード](https://github.com/msickpaler/postgraphile-next-tailwind-mantin-graphql-portfolio/blob/master/nextjs/src/pages/delete-user/index.tsx)
- 投稿閲覧ページ(ISR)
  - [実際のページ](https://postgraphile-next-tailwind-mantin-graphql-portfolio.vercel.app/posts/103)
  - [ソースコード](https://github.com/msickpaler/postgraphile-next-tailwind-mantin-graphql-portfolio/blob/master/nextjs/src/pages/posts/%5Bpid%5D/index.tsx)
- 新規投稿ページ(SSR)
  - [実際のページ](https://postgraphile-next-tailwind-mantin-graphql-portfolio.vercel.app/posts/new)
  - [ソースコード](https://github.com/msickpaler/postgraphile-next-tailwind-mantin-graphql-portfolio/blob/master/nextjs/src/pages/posts/new/index.tsx)
- 投稿編集ページ(SSR)
  - [実際のページ](https://postgraphile-next-tailwind-mantin-graphql-portfolio.vercel.app/posts/103/edit)
  - [ソースコード](https://github.com/msickpaler/postgraphile-next-tailwind-mantin-graphql-portfolio/blob/master/nextjs/src/pages/posts/%5Bpid%5D/edit.tsx)
- 404 ページ(SSG)
  - [実際のページ](https://postgraphile-next-tailwind-mantin-graphql-portfolio.vercel.app/tekitou)
  - [ソースコード](https://github.com/msickpaler/postgraphile-next-tailwind-mantin-graphql-portfolio/blob/master/nextjs/src/pages/404.tsx)
- データ閲覧ページ(ISR)
  - [実際のページ](https://postgraphile-next-tailwind-mantin-graphql-portfolio.vercel.app/data)
  - [ソースコード](https://github.com/msickpaler/postgraphile-next-tailwind-mantin-graphql-portfolio/blob/master/nextjs/src/pages/data/index.tsx)

## その他

- Apollo の設定してるファイル: https://github.com/msickpaler/postgraphile-next-tailwind-mantin-graphql-portfolio/blob/master/nextjs/src/contexts/MyApolloProvider.tsx

- next.js のフォント最適化: https://github.com/msickpaler/postgraphile-next-tailwind-mantin-graphql-portfolio/blob/5da04f755e7a93b208f2c0b88ea74922b027b2b0/nextjs/src/pages/_app.tsx#L34

- Mantine のデフォルトテーマのカスタマイズ: https://github.com/msickpaler/postgraphile-next-tailwind-mantin-graphql-portfolio/blob/5da04f755e7a93b208f2c0b88ea74922b027b2b0/nextjs/src/pages/_app.tsx#L46

- debounce を使った自動保存: https://github.com/msickpaler/postgraphile-next-tailwind-mantin-graphql-portfolio/blob/535fe369a5ea9345b7d9c3cd03126a49b6ce10d2/nextjs/src/layouts/GlobalHeader.tsx#L109
