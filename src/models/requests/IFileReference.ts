export interface IFileReference {
//     public string PublicUrl { get; set; }
// public string FileName { get; set; }
// public long SizeBytes { get; set; }
// public string Source { get; set; }
//
// public Guid? ListingId { get; set; }
// public Guid? UserId { get; set; }
//
// public bool IsPrimaryImage { get; set; }
// public string Description { get; set; }
    publicUrl: string;
    fileName: string;
    sizeBytes: number;
    description: string;
    source: string;
    userId?: string;
}
