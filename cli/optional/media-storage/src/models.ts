export interface MediaStorageService {
    storeFile(filePath: string, content: Buffer): Promise<FileInformation>
    getFileInformation(filePath: string): Promise<FileInformation>
    deleteFile(filePath: string): Promise<void>
    searchFiles(params: SearchFileParams): Promise<FileInformation[]>
    getFileContent(filePath: string): Promise<Buffer>
    copy(sourcePath: string, destinationPath: string): Promise<void>
}

export type SearchFileParams = {
    prefix?: string
}

export interface FileInformation {
    filePath: string
    url: string
}

export type Media = {
    path: string
    content: Buffer
}
