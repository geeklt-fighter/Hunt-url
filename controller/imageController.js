const azureStorage = require('azure-storage')

const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')

const { AZURE_CSTRING_DEV } = process.env

const blobService = azureStorage.createBlobService(AZURE_CSTRING_DEV)


const getBlobImageUrl = (url) => {

    let urlwithoutqstr = url.split("?")[0]
    let file = url.split("/")
    let container = file[file.length - 2]
    let blob = file[file.length - 1]
    
    let sasToken = blobService.generateSharedAccessSignature(container, blob, {
        AccessPolicy: {
            Permissions: azureStorage.BlobUtilities.SharedAccessPermissions.READ,
            Start: azureStorage.date.daysFromNow(0),
            Expiry: azureStorage.date.daysFromNow(14)
        }
    })
    return `${urlwithoutqstr}?${sasToken}`
}


exports.getSasUrl = catchAsync(async (req, res, next) => {
   
    let url = getBlobImageUrl(req.body.url)

    /** 明天完成更新資料到資料庫，把調整過的sas_url重新寫進資料庫 */

    res.status(200).json({
        status: 'success'
    })
})