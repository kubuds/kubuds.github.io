# 上海苦芽科技有限公司官网

> 网站基于 jekyll 开发，原始模板来源于公开免费的模板：Business Jekyll Theme, 感谢模板作者的贡献， 以下简介摘自于该模板 github 仓库的 README：

> Business Jekyll Theme is a theme that is designed to be used for small and medium business. It is designed by a team from [Technext](https://github.com/technext/). The theme is then ported over by [Melvin Ch'ng](http://melvinchng.github.io) for Jekyll support. The original source code can be obainted from Technext's [repository](https://github.com/technext/office)

### 网站地址

- [kubuds.io](https://kubuds.io)

## 开发部署

1. 安装 jekyll: [official website](https://jekyllrb.com/docs/)
2. 下载本仓库代码
3. 在代码根目录下，安装项目依赖的所有 gem 包:

```
bundle install
```

4. 本地运行:

```
bundle exec jekyll serve -d docs
```

> jekyll 编译后的静态文件默认输出到\_site 目录，我们改为 docs，跟 github pages 的要求保持一致

5. 提交代码。代码提交到 github 以后，github 会直接访问 docs 文件夹作为网站发布源。
