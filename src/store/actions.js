export default {
    changeImgPath: (ctx, imgPath) => {
        // 发送mutataion
        ctx.commit('changeImgPath', imgPath);
    },
    changeUserInfo: (ctx, data) => {
        // 发送mutataion
        ctx.commit('changeUserInfo', data);
    }
}