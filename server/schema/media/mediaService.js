const destructMedia = media => ({
    media: {
        id: media.id,
        url: media.url,
        creationDate: media.creationDate
    },
});


const addMedia = Media => async data => {
    return new Promise(async function(resolve, reject) {
        try {
            const newMedia = new Media({
                url: data.url
            });
            let newMediaObj = await newMedia.save();
            resolve(destructMedia(newMediaObj));
        } catch (error) {
            reject(error);
        }

    })
}




module.exports = Media => ({
    addMedia: addMedia(Media),
    destructMedia: destructMedia
});