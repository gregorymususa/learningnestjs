/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Bookmark` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Bookmark] ADD [userId] INT NOT NULL;

-- CreateIndex
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_email_key] UNIQUE NONCLUSTERED ([email]);

-- AddForeignKey
ALTER TABLE [dbo].[Bookmark] ADD CONSTRAINT [Bookmark_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
