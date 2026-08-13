//批量导入图片，并返回对象
const imageModules = import.meta.glob('@/static/images/*.{png,jpg,jpeg,svg,gif,webp}', { eager: true, query: '?url', import:'default' })
//将对象的key处理简单
export const images = Object.fromEntries(
  Object.entries(imageModules).map(([path, url]) => {
    let newPath = path.split('/').pop()
    return [newPath, url]
  })
)