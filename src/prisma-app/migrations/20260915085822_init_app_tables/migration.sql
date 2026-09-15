BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Tracking_Check] (
    [tracking_id] UNIQUEIDENTIFIER NOT NULL,
    [shipment_code] VARCHAR(10) NOT NULL,
    [shipment_cmp_seq] INT NOT NULL,
    [checked_at] DATETIME NOT NULL CONSTRAINT [Tracking_Check_checked_at_df] DEFAULT CURRENT_TIMESTAMP,
    [returned_eta] DATE,
    [returned_status] VARCHAR(50),
    [success] BIT NOT NULL,
    [trigger_source] VARCHAR(20),
    [error_type] VARCHAR(50),
    [error_message] VARCHAR(1000),
    CONSTRAINT [Tracking_Check_pkey] PRIMARY KEY CLUSTERED ([tracking_id])
);

-- CreateTable
CREATE TABLE [dbo].[Shipment_Document_Status] (
    [document_status_id] UNIQUEIDENTIFIER NOT NULL,
    [shipment_code] VARCHAR(10) NOT NULL,
    [shipment_cmp_seq] INT NOT NULL,
    [document_type] VARCHAR(50) NOT NULL,
    [is_missing] BIT NOT NULL,
    [checked_at] DATETIME NOT NULL CONSTRAINT [Shipment_Document_Status_checked_at_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Shipment_Document_Status_pkey] PRIMARY KEY CLUSTERED ([document_status_id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Tracking_Check_shipment_code_shipment_cmp_seq_idx] ON [dbo].[Tracking_Check]([shipment_code], [shipment_cmp_seq]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Shipment_Document_Status_shipment_code_shipment_cmp_seq_idx] ON [dbo].[Shipment_Document_Status]([shipment_code], [shipment_cmp_seq]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
