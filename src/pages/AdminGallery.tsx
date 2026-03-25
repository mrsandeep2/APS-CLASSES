import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Cropper, { Area } from "react-easy-crop";
import { Trash2, Upload, LogIn, LogOut, ImagePlus, Megaphone, Plus, X, Crop, Trophy, Film, Edit2, Eye, EyeOff, ZoomIn, House, Users, Award, Phone, Check } from "lucide-react";
import { toast } from "sonner";

const categories = ["Test", "Cultural", "Academics", "Events"];
const providedHeroBannerPaths = ["/hero-import/APS-BANNER-1.png", "/hero-import/APS-BANNER-2.png"];
const TOTAL_RESULT_MARKS = 500;
const DEFAULT_RESULT_AVATARS = {
  Male: "/default-avatars/male%20avatar.jpg",
  Female: "/default-avatars/female%20avatar.jpg",
} as const;
type ResultGender = keyof typeof DEFAULT_RESULT_AVATARS;
const LEGACY_DEFAULT_RESULT_AVATARS = ["/default-avatars/male.svg", "/default-avatars/female.svg"];

const getResultGenderFromPhoto = (photoUrl: string | null): ResultGender => {
  if (photoUrl === DEFAULT_RESULT_AVATARS.Female) return "Female";
  return "Male";
};

const isDefaultResultAvatar = (photoUrl: string | null) => {
  return (
    photoUrl === DEFAULT_RESULT_AVATARS.Male ||
    photoUrl === DEFAULT_RESULT_AVATARS.Female ||
    (photoUrl ? LEGACY_DEFAULT_RESULT_AVATARS.includes(photoUrl) : false)
  );
};

const usesAutoResultAvatar = (photoUrl: string | null) => {
  return !photoUrl || isDefaultResultAvatar(photoUrl);
};

const getGradeFromPercentage = (percentage: number) => {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C+";
  return "C";
};

interface StudentResult {
  id: string;
  student_name: string;
  student_class: string;
  percentage: number;
  marks_obtained: number;
  total_marks: number;
  grade: string;
  year: string;
  photo_url: string | null;
}

interface GalleryImage {
  id: string;
  image_url: string;
  category: string;
  title: string | null;
  created_at: string;
}

interface Notice {
  id: string;
  text: string;
  is_active: boolean;
  created_at: string;
}

interface HeroBanner {
  id: string;
  title: string | null;
  subtitle: string | null;
  image_url: string;
  cta_label: string | null;
  cta_link: string | null;
  cta_secondary_label: string | null;
  cta_secondary_link: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  qualification: string | null;
  point_one: string | null;
  point_two: string | null;
  mobile_number: string | null;
  image_url: string | null;
  updated_at: string;
}

const ImageCropper = ({
  file,
  onCrop,
  onCancel,
  mode,
}: {
  file: File;
  onCrop: (blob: Blob) => void;
  onCancel: () => void;
  mode: "gallery" | "hero" | "result" | "team";
}) => {
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setImgSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const createImage = (url: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = url;
    });

  const getCroppedBlob = async (source: string, pixelCrop: Area) => {
    const image = await createImage(source);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Failed to create crop canvas");
    }

    canvas.width = Math.max(1, Math.round(pixelCrop.width));
    canvas.height = Math.max(1, Math.round(pixelCrop.height));

    context.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      canvas.width,
      canvas.height,
    );

    const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Failed to generate cropped image"));
        },
        outputType,
        0.92,
      );
    });
  };

  const onCropComplete = (_croppedArea: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  };

  const doCrop = async () => {
    if (!croppedAreaPixels) return;
    try {
      const blob = await getCroppedBlob(imgSrc, croppedAreaPixels);
      onCrop(blob);
    } catch {
      toast.error("Could not crop image. Try upload full image instead.");
    }
  };

  const cropAspect = mode === "hero" ? 16 / 9 : 1;
  const useCircleCrop = mode === "result" || mode === "team";

  useEffect(() => {
    // Circle crops should start slightly zoomed out so more image fits in the circle.
    setZoom(useCircleCrop ? 0.85 : 1);
    setCrop({ x: 0, y: 0 });
  }, [useCircleCrop, file]);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl p-4 max-w-xl w-full space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <Crop className="w-5 h-5 text-secondary" /> Crop Image
          </h3>
          <button onClick={onCancel}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-muted-foreground">
          {useCircleCrop
            ? "Circle crop mode: move image and zoom to fit face/profile inside circle."
            : "Easy mode: drag image to position and use zoom slider."}
        </p>

        <div className="relative w-full h-72 rounded-lg overflow-hidden bg-black">
          <Cropper
            image={imgSrc}
            crop={crop}
            zoom={zoom}
            aspect={cropAspect}
            cropShape={useCircleCrop ? "round" : "rect"}
            minZoom={useCircleCrop ? 0.6 : 1}
            maxZoom={useCircleCrop ? 2.5 : 3}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            objectFit="cover"
            showGrid={false}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><ZoomIn className="w-3.5 h-3.5" /> Zoom</span>
            <span>{zoom.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min={useCircleCrop ? 0.6 : 1}
            max={useCircleCrop ? 2.5 : 3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button onClick={doCrop} className="flex-1">
            Crop & Upload
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              file.arrayBuffer().then((buf) => onCrop(new Blob([buf], { type: file.type })));
            }}
            className="flex-1"
          >
            Upload Full
          </Button>
        </div>
      </div>
    </div>
  );
};

const AdminGallery = () => {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [results, setResults] = useState<StudentResult[]>([]);
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [teamMember, setTeamMember] = useState<TeamMember | null>(null);

  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Academics");
  const [title, setTitle] = useState("");
  const [newNotice, setNewNotice] = useState("");
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [cropMode, setCropMode] = useState<"gallery" | "hero" | "result" | "team">("gallery");
  const [tab, setTab] = useState<"gallery" | "notices" | "results" | "team" | "hero">("gallery");
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryImage | null>(null);
  const [galleryEditTitle, setGalleryEditTitle] = useState("");
  const [galleryEditCategory, setGalleryEditCategory] = useState(categories[0]);
  const [pendingGalleryImageReplace, setPendingGalleryImageReplace] = useState<GalleryImage | null>(null);
  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);
  const [editingNoticeText, setEditingNoticeText] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const multiHeroFileInputRef = useRef<HTMLInputElement>(null);
  const galleryReplaceInputRef = useRef<HTMLInputElement>(null);
  const resultPhotoInputRef = useRef<HTMLInputElement>(null);
  const editResultPhotoInputRef = useRef<HTMLInputElement>(null);
  const teamPhotoInputRef = useRef<HTMLInputElement>(null);

  const [heroEditingId, setHeroEditingId] = useState<string | null>(null);
  const [heroFormData, setHeroFormData] = useState({
    title: "",
    subtitle: "",
    cta_label: "",
    cta_link: "",
    cta_secondary_label: "",
    cta_secondary_link: "",
    is_active: true,
  });
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [showHeroForm, setShowHeroForm] = useState(false);

  const [rName, setRName] = useState("");
  const [rClass, setRClass] = useState("Class 10th");
  const [rMarks, setRMarks] = useState("");
  const [rYear, setRYear] = useState("2024-25");
  const [rGender, setRGender] = useState<ResultGender>("Male");
  const [rPhotoBlob, setRPhotoBlob] = useState<Blob | null>(null);
  const [rPhotoPreview, setRPhotoPreview] = useState<string>("");
  const [resultPhotoTarget, setResultPhotoTarget] = useState<"add" | "edit">("add");
  const [editingResultId, setEditingResultId] = useState<string | null>(null);
  const [editResultName, setEditResultName] = useState("");
  const [editResultClass, setEditResultClass] = useState("Class 10th");
  const [editResultMarks, setEditResultMarks] = useState("");
  const [editResultYear, setEditResultYear] = useState("2024-25");
  const [editResultGender, setEditResultGender] = useState<ResultGender>("Male");
  const [editResultPhotoBlob, setEditResultPhotoBlob] = useState<Blob | null>(null);
  const [editResultPhotoPreview, setEditResultPhotoPreview] = useState("");

  const [teamFormData, setTeamFormData] = useState({
    name: "Munna Sir",
    role: "Director & Founder",
    qualification: "",
    point_one: "",
    point_two: "",
    mobile_number: "",
  });
  const [teamImageUrl, setTeamImageUrl] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchImages();
      fetchNotices();
      fetchResults();
      fetchTeamMember();
      fetchHeroBanners();
    }
  }, [session]);

  const fetchImages = async () => {
    const { data } = await (supabase as any).from("gallery_images").select("*").order("created_at", { ascending: false });
    if (data) setImages(data as GalleryImage[]);
  };

  const fetchNotices = async () => {
    const { data } = await (supabase as any).from("notices").select("*").order("created_at", { ascending: false });
    if (data) setNotices(data as Notice[]);
  };

  const fetchResults = async () => {
    const { data } = await (supabase as any).from("student_results").select("*").order("created_at", { ascending: false });
    if (data) setResults(data as StudentResult[]);
  };

  const fetchHeroBanners = async () => {
    const { data } = await (supabase as any).from("hero_banners").select("*").order("display_order", { ascending: true });
    if (data) setBanners(data as HeroBanner[]);
  };

  const fetchTeamMember = async () => {
    const { data } = await (supabase as any).from("team_members").select("*").order("updated_at", { ascending: false }).limit(1).maybeSingle();

    if (!data) return;

    setTeamMember(data as TeamMember);
    setTeamFormData({
      name: data.name || "Munna Sir",
      role: data.role || "Director & Founder",
      qualification: data.qualification || "",
      point_one: data.point_one || "",
      point_two: data.point_two || "",
      mobile_number: data.mobile_number || "",
    });
    setTeamImageUrl(data.image_url || "");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) toast.error(error.message);
    else toast.success("Logged in");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!pendingGalleryImageReplace && images.length >= 12) {
      toast.error("Maximum 12 images allowed. Delete some to add more.");
      return;
    }
    setCropMode("gallery");
    setCropFile(file);
    e.target.value = "";
  };

  const handleCropUpload = async (blob: Blob) => {
    setCropFile(null);
    setUploading(true);
    const path = `${Date.now()}.jpg`;
    const { error: uploadError } = await supabase.storage.from("gallery").upload(path, blob);
    if (uploadError) {
      if (uploadError.message.toLowerCase().includes("bucket not found")) {
        toast.error("Upload failed: storage bucket 'gallery' is missing. Run latest Supabase migrations.");
      } else {
        toast.error("Upload failed: " + uploadError.message);
      }
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(path);
    if (pendingGalleryImageReplace) {
      const { error: updateError } = await (supabase as any)
        .from("gallery_images")
        .update({ image_url: urlData.publicUrl })
        .eq("id", pendingGalleryImageReplace.id);

      if (updateError) {
        toast.error("Failed to replace image: " + updateError.message);
      } else {
        const oldFileName = pendingGalleryImageReplace.image_url.split("/").pop();
        if (oldFileName) {
          await supabase.storage.from("gallery").remove([oldFileName]);
        }
        toast.success("Gallery image replaced");
        setPendingGalleryImageReplace(null);
        fetchImages();
      }
    } else {
      const { error: dbError } = await (supabase as any).from("gallery_images").insert({
        image_url: urlData.publicUrl,
        category: selectedCategory,
        title: title || null,
      });

      if (dbError) {
        toast.error("Failed to save: " + dbError.message);
      } else {
        toast.success("Image uploaded");
        setTitle("");
        fetchImages();
      }
    }

    setUploading(false);
  };

  const startEditGalleryItem = (img: GalleryImage) => {
    setEditingGalleryItem(img);
    setGalleryEditTitle(img.title || "");
    setGalleryEditCategory(img.category || categories[0]);
  };

  const cancelEditGalleryItem = () => {
    setEditingGalleryItem(null);
    setGalleryEditTitle("");
    setGalleryEditCategory(categories[0]);
  };

  const handleSaveGalleryEdit = async () => {
    if (!editingGalleryItem) return;

    const { error } = await (supabase as any)
      .from("gallery_images")
      .update({
        title: galleryEditTitle.trim() || null,
        category: galleryEditCategory,
      })
      .eq("id", editingGalleryItem.id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Gallery details updated");
    cancelEditGalleryItem();
    fetchImages();
  };

  const handleReplaceGalleryImageSelect = (img: GalleryImage) => {
    setPendingGalleryImageReplace(img);
    setCropMode("gallery");
    galleryReplaceInputRef.current?.click();
  };

  const handleDelete = async (img: GalleryImage) => {
    const fileName = img.image_url.split("/").pop();
    if (fileName) await supabase.storage.from("gallery").remove([fileName]);
    await (supabase as any).from("gallery_images").delete().eq("id", img.id);
    toast.success("Image deleted");
    fetchImages();
  };

  const handleAddNotice = async () => {
    if (!newNotice.trim()) return;
    const { error } = await (supabase as any).from("notices").insert({ text: newNotice.trim() });
    if (error) toast.error(error.message);
    else {
      toast.success("Notice added");
      setNewNotice("");
      fetchNotices();
    }
  };

  const handleToggleNotice = async (notice: Notice) => {
    await (supabase as any).from("notices").update({ is_active: !notice.is_active }).eq("id", notice.id);
    fetchNotices();
  };

  const handleDeleteNotice = async (id: string) => {
    await (supabase as any).from("notices").delete().eq("id", id);
    toast.success("Notice deleted");
    fetchNotices();
  };

  const startEditNotice = (notice: Notice) => {
    setEditingNoticeId(notice.id);
    setEditingNoticeText(notice.text);
  };

  const cancelEditNotice = () => {
    setEditingNoticeId(null);
    setEditingNoticeText("");
  };

  const handleSaveNoticeEdit = async () => {
    if (!editingNoticeId || !editingNoticeText.trim()) {
      toast.error("Notice text is required");
      return;
    }

    const { error } = await (supabase as any)
      .from("notices")
      .update({ text: editingNoticeText.trim() })
      .eq("id", editingNoticeId);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Notice updated");
    cancelEditNotice();
    fetchNotices();
  };

  const handleAddResult = async () => {
    if (!rName.trim()) return;

    const obtainedMarks = Number(rMarks);
    if (!Number.isFinite(obtainedMarks)) {
      toast.error("Please enter valid obtained marks");
      return;
    }

    if (obtainedMarks < 0 || obtainedMarks > TOTAL_RESULT_MARKS) {
      toast.error(`Obtained marks must be between 0 and ${TOTAL_RESULT_MARKS}`);
      return;
    }

    setUploading(true);

    const percentage = Number(((obtainedMarks / TOTAL_RESULT_MARKS) * 100).toFixed(2));
    const grade = getGradeFromPercentage(percentage);
    let photoUrl: string | null = null;

    if (rPhotoBlob) {
      const ext = rPhotoBlob.type === "image/png" ? "png" : "jpg";
      const path = `result-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("student-results").upload(path, rPhotoBlob, {
        contentType: rPhotoBlob.type || "image/jpeg",
      });

      if (uploadError) {
        if (uploadError.message.toLowerCase().includes("bucket not found")) {
          toast.error("Upload failed: storage bucket 'student-results' is missing. Run latest Supabase migrations.");
        } else {
          toast.error("Photo upload failed: " + uploadError.message);
        }
        setUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage.from("student-results").getPublicUrl(path);
      photoUrl = urlData.publicUrl;
    }

    if (!photoUrl) {
      photoUrl = DEFAULT_RESULT_AVATARS[rGender];
    }

    const { error } = await (supabase as any).from("student_results").insert({
      student_name: rName.trim(),
      student_class: rClass,
      percentage,
      marks_obtained: obtainedMarks,
      total_marks: TOTAL_RESULT_MARKS,
      grade,
      year: rYear,
      photo_url: photoUrl,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Result added");
      setRName("");
      setRMarks("");
      setRGender("Male");
      setRPhotoBlob(null);
      setRPhotoPreview("");
      if (resultPhotoInputRef.current) resultPhotoInputRef.current.value = "";
      fetchResults();
    }

    setUploading(false);
  };

  const handleDeleteResult = async (result: StudentResult) => {
    if (result.photo_url && result.photo_url.includes("/student-results/")) {
      const filePath = result.photo_url.split("/student-results/")[1];
      if (filePath) {
        await supabase.storage.from("student-results").remove([decodeURIComponent(filePath)]);
      }
    }

    await (supabase as any).from("student_results").delete().eq("id", result.id);
    toast.success("Result deleted");
    fetchResults();
  };

  const handleResultPhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setResultPhotoTarget("add");
    setCropMode("result");
    setCropFile(file);
  };

  const handleEditResultPhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setResultPhotoTarget("edit");
    setCropMode("result");
    setCropFile(file);
  };

  const handleResultCropUpload = (blob: Blob) => {
    setCropFile(null);

    if (resultPhotoTarget === "edit") {
      setEditResultPhotoBlob(blob);
      setEditResultPhotoPreview(URL.createObjectURL(blob));
      toast.success("Updated student photo cropped");
      return;
    }

    setRPhotoBlob(blob);
    setRPhotoPreview(URL.createObjectURL(blob));
    toast.success("Student photo cropped");
  };

  const startEditResult = (result: StudentResult) => {
    setEditingResultId(result.id);
    setEditResultName(result.student_name);
    setEditResultClass(result.student_class);
    setEditResultMarks(String(result.marks_obtained));
    setEditResultYear(result.year);
    setEditResultGender(getResultGenderFromPhoto(result.photo_url));
    setEditResultPhotoBlob(null);
    setEditResultPhotoPreview(result.photo_url || DEFAULT_RESULT_AVATARS[getResultGenderFromPhoto(result.photo_url)]);
  };

  const cancelEditResult = () => {
    setEditingResultId(null);
    setEditResultName("");
    setEditResultClass("Class 10th");
    setEditResultMarks("");
    setEditResultYear("2024-25");
    setEditResultGender("Male");
    setEditResultPhotoBlob(null);
    setEditResultPhotoPreview("");
  };

  const handleSaveResultEdit = async (result: StudentResult) => {
    if (!editingResultId || !editResultName.trim()) {
      toast.error("Student name is required");
      return;
    }

    const obtainedMarks = Number(editResultMarks);
    if (!Number.isFinite(obtainedMarks)) {
      toast.error("Please enter valid obtained marks");
      return;
    }

    if (obtainedMarks < 0 || obtainedMarks > TOTAL_RESULT_MARKS) {
      toast.error(`Obtained marks must be between 0 and ${TOTAL_RESULT_MARKS}`);
      return;
    }

    setUploading(true);

    const percentage = Number(((obtainedMarks / TOTAL_RESULT_MARKS) * 100).toFixed(2));
    const grade = getGradeFromPercentage(percentage);
    let photoUrl = result.photo_url;

    if (editResultPhotoBlob) {
      const ext = editResultPhotoBlob.type === "image/png" ? "png" : "jpg";
      const path = `result-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { error: uploadError } = await supabase.storage.from("student-results").upload(path, editResultPhotoBlob, {
        contentType: editResultPhotoBlob.type || "image/jpeg",
      });

      if (uploadError) {
        toast.error("Photo upload failed: " + uploadError.message);
        setUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage.from("student-results").getPublicUrl(path);
      photoUrl = urlData.publicUrl;

      if (result.photo_url && result.photo_url.includes("/student-results/")) {
        const oldFilePath = result.photo_url.split("/student-results/")[1];
        if (oldFilePath) {
          await supabase.storage.from("student-results").remove([decodeURIComponent(oldFilePath)]);
        }
      }
    }

    if (!editResultPhotoBlob && usesAutoResultAvatar(result.photo_url)) {
      photoUrl = DEFAULT_RESULT_AVATARS[editResultGender];
    }

    const { error } = await (supabase as any)
      .from("student_results")
      .update({
        student_name: editResultName.trim(),
        student_class: editResultClass,
        marks_obtained: obtainedMarks,
        total_marks: TOTAL_RESULT_MARKS,
        percentage,
        grade,
        year: editResultYear,
        photo_url: photoUrl,
      })
      .eq("id", editingResultId);

    setUploading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Result updated");
    cancelEditResult();
    fetchResults();
  };

  const handleTeamImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setCropMode("team");
    setCropFile(file);
  };

  const handleTeamCropUpload = async (blob: Blob) => {
    setCropFile(null);

    setUploading(true);
    const ext = blob.type === "image/png" ? "png" : "jpg";
    const path = `team-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("team-members").upload(path, blob, {
      contentType: blob.type || "image/jpeg",
    });

    if (uploadError) {
      if (uploadError.message.toLowerCase().includes("bucket not found")) {
        toast.error("Upload failed: storage bucket 'team-members' is missing. Run latest Supabase migrations.");
      } else {
        toast.error("Team photo upload failed: " + uploadError.message);
      }
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("team-members").getPublicUrl(path);
    setTeamImageUrl(urlData.publicUrl);
    toast.success("Team member image uploaded");
    setUploading(false);
  };

  const handleSaveTeamMember = async () => {
    if (!teamFormData.name.trim()) {
      toast.error("Team member name is required");
      return;
    }

    setUploading(true);
    const payload = {
      name: teamFormData.name.trim(),
      role: teamFormData.role.trim() || "Director & Founder",
      qualification: teamFormData.qualification.trim() || null,
      point_one: teamFormData.point_one.trim() || null,
      point_two: teamFormData.point_two.trim() || null,
      mobile_number: teamFormData.mobile_number.trim() || null,
      image_url: teamImageUrl || null,
      updated_at: new Date().toISOString(),
    };

    try {
      if (teamMember?.id) {
        const { error } = await (supabase as any).from("team_members").update(payload).eq("id", teamMember.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any).from("team_members").insert(payload);
        if (error) throw error;
      }

      toast.success("Our Team details updated");
      await fetchTeamMember();
    } catch (error: any) {
      toast.error(error.message || "Failed to save team details");
    } finally {
      setUploading(false);
    }
  };

  const handleHeroFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCropMode("hero");
    setCropFile(file);
    e.target.value = "";
  };

  const insertHeroBannerRecord = async (imageUrl: string, fallbackTitle?: string) => {
    const payload = {
      title: heroFormData.title.trim() || fallbackTitle || "Hero Banner",
      subtitle: heroFormData.subtitle.trim() || null,
      image_url: imageUrl,
      cta_label: heroFormData.cta_label.trim() || null,
      cta_link: heroFormData.cta_link.trim() || null,
      cta_secondary_label: heroFormData.cta_secondary_label.trim() || null,
      cta_secondary_link: heroFormData.cta_secondary_link.trim() || null,
      is_active: heroFormData.is_active,
      display_order: banners.length,
    };

    const { error } = await (supabase as any).from("hero_banners").insert(payload);
    if (error) throw error;
  };

  const handleHeroBulkFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    e.target.value = "";
    if (files.length === 0) return;

    setUploading(true);
    let successCount = 0;

    try {
      for (const file of files) {
        const extension = file.name.split(".").pop() || "jpg";
        const path = `hero-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;

        const { error: uploadError } = await supabase.storage.from("hero-banners").upload(path, file);
        if (uploadError) {
          if (uploadError.message.toLowerCase().includes("bucket not found")) {
            throw new Error("Upload failed: storage bucket 'hero-banners' is missing. Run latest Supabase migrations.");
          }
          throw uploadError;
        }

        const { data: urlData } = supabase.storage.from("hero-banners").getPublicUrl(path);
        const fileTitle = file.name.replace(/\.[^/.]+$/, "");
        await insertHeroBannerRecord(urlData.publicUrl, fileTitle);
        successCount += 1;
      }

      await fetchHeroBanners();
      resetHeroForm();
      toast.success(`${successCount} hero banner${successCount > 1 ? "s" : ""} added`);
    } catch (error: any) {
      toast.error(error.message || "Bulk upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleImportProvidedPathBanners = async () => {
    setUploading(true);
    try {
      const alreadyPresent = new Set(
        banners
          .map((banner) => banner.image_url)
          .filter((url) => url.includes("/hero-import/APS-BANNER-")),
      );

      let inserted = 0;

      for (const relativePath of providedHeroBannerPaths) {
        if (alreadyPresent.has(relativePath)) continue;

        const { error } = await (supabase as any).from("hero_banners").insert({
          title: "APS Coaching Classes",
          subtitle: null,
          image_url: relativePath,
          cta_label: "Enroll Now",
          cta_link: "/admission",
          cta_secondary_label: "Contact",
          cta_secondary_link: "/contact",
          is_active: true,
          display_order: banners.length + inserted,
        });

        if (error) throw error;
        inserted += 1;
      }

      await fetchHeroBanners();

      if (inserted === 0) {
        toast.success("Provided path banners are already in dashboard");
      } else {
        toast.success(`${inserted} provided banner${inserted > 1 ? "s" : ""} imported`);
      }
    } catch (error: any) {
      toast.error(error.message || "Could not import provided banners");
    } finally {
      setUploading(false);
    }
  };

  const handleHeroCropUpload = async (blob: Blob) => {
    setCropFile(null);
    setUploading(true);

    const path = `hero-${Date.now()}.jpg`;
    const { error: uploadError } = await supabase.storage.from("hero-banners").upload(path, blob);
    if (uploadError) {
      if (uploadError.message.toLowerCase().includes("bucket not found")) {
        toast.error("Upload failed: storage bucket 'hero-banners' is missing. Run latest Supabase migrations.");
      } else {
        toast.error("Upload failed: " + uploadError.message);
      }
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("hero-banners").getPublicUrl(path);

    // In add mode, persist immediately so uploaded banners appear in card view right away.
    if (!heroEditingId) {
      const { error: insertError } = await (supabase as any)
        .from("hero_banners")
        .insert({
          title: heroFormData.title.trim() || "Hero Banner",
          subtitle: heroFormData.subtitle.trim() || null,
          image_url: urlData.publicUrl,
          cta_label: heroFormData.cta_label.trim() || null,
          cta_link: heroFormData.cta_link.trim() || null,
          cta_secondary_label: heroFormData.cta_secondary_label.trim() || null,
          cta_secondary_link: heroFormData.cta_secondary_link.trim() || null,
          is_active: heroFormData.is_active,
          display_order: banners.length,
        });

      if (insertError) {
        toast.error("Hero upload saved to storage, but DB insert failed: " + insertError.message);
      } else {
        toast.success("Hero banner added");
        resetHeroForm();
        await fetchHeroBanners();
      }
      setUploading(false);
      return;
    }

    setHeroImageUrl(urlData.publicUrl);
    toast.success("Hero image uploaded. Click Update to save changes.");
    setUploading(false);
  };

  const handleHeroSave = async () => {
    if (!heroImageUrl) {
      toast.error("Image is required");
      return;
    }

    setUploading(true);
    try {
      if (heroEditingId) {
        const { error } = await (supabase as any)
          .from("hero_banners")
          .update({
            ...heroFormData,
            title: heroFormData.title.trim() || null,
            image_url: heroImageUrl,
            updated_at: new Date().toISOString(),
          })
          .eq("id", heroEditingId);
        if (error) throw error;
        toast.success("Hero banner updated");
      } else {
        const { error } = await (supabase as any).from("hero_banners").insert({
          ...heroFormData,
          title: heroFormData.title.trim() || null,
          image_url: heroImageUrl,
          display_order: banners.length,
        });
        if (error) throw error;
        toast.success("Hero banner created");
      }

      resetHeroForm();
      fetchHeroBanners();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleHeroEdit = (banner: HeroBanner) => {
    setShowHeroForm(true);
    setHeroEditingId(banner.id);
    setHeroFormData({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      cta_label: banner.cta_label || "",
      cta_link: banner.cta_link || "",
      cta_secondary_label: banner.cta_secondary_label || "",
      cta_secondary_link: banner.cta_secondary_link || "",
      is_active: banner.is_active,
    });
    setHeroImageUrl(banner.image_url);
  };

  const handleHeroDelete = async (id: string, imageUrl: string) => {
    if (!confirm("Delete this banner?")) return;
    const fileName = imageUrl.split("/").pop();
    if (fileName) await supabase.storage.from("hero-banners").remove([fileName]);
    await (supabase as any).from("hero_banners").delete().eq("id", id);
    toast.success("Hero banner deleted");
    fetchHeroBanners();
  };

  const handleHeroToggleActive = async (banner: HeroBanner) => {
    await (supabase as any).from("hero_banners").update({ is_active: !banner.is_active }).eq("id", banner.id);
    fetchHeroBanners();
  };

  const resetHeroForm = () => {
    setShowHeroForm(false);
    setHeroEditingId(null);
    setHeroFormData({
      title: "",
      subtitle: "",
      cta_label: "",
      cta_link: "",
      cta_secondary_label: "",
      cta_secondary_link: "",
      is_active: true,
    });
    setHeroImageUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openAddHeroForm = () => {
    setHeroEditingId(null);
    setHeroFormData({
      title: "",
      subtitle: "",
      cta_label: "",
      cta_link: "",
      cta_secondary_label: "",
      cta_secondary_link: "",
      is_active: true,
    });
    setHeroImageUrl("");
    setShowHeroForm(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="bg-card p-8 rounded-2xl shadow-lg border border-border w-full max-w-sm space-y-4">
          <div className="text-center mb-4">
            <LogIn className="w-10 h-10 mx-auto text-secondary mb-2" />
            <h1 className="text-xl font-bold font-heading">Admin Login</h1>
            <p className="text-sm text-muted-foreground">Gallery, Notices, Results and Hero Banners</p>
          </div>
          <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {cropFile && (
        <ImageCropper
          file={cropFile}
          mode={cropMode}
          onCrop={
            cropMode === "hero"
              ? handleHeroCropUpload
              : cropMode === "result"
              ? handleResultCropUpload
              : cropMode === "team"
              ? handleTeamCropUpload
              : handleCropUpload
          }
          onCancel={() => {
            setCropFile(null);
            setPendingGalleryImageReplace(null);
          }}
        />
      )}

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold font-heading">Admin Dashboard</h1>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/">
                <House className="w-4 h-4 mr-1" /> Back to Home
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={() => supabase.auth.signOut()}>
              <LogOut className="w-4 h-4 mr-1" /> Logout
            </Button>
          </div>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          <Button variant={tab === "gallery" ? "default" : "outline"} onClick={() => setTab("gallery")} size="sm">
            <ImagePlus className="w-4 h-4 mr-1" /> Gallery
          </Button>
          <Button variant={tab === "notices" ? "default" : "outline"} onClick={() => setTab("notices")} size="sm">
            <Megaphone className="w-4 h-4 mr-1" /> Notices
          </Button>
          <Button variant={tab === "results" ? "default" : "outline"} onClick={() => setTab("results")} size="sm">
            <Trophy className="w-4 h-4 mr-1" /> Results
          </Button>
          <Button variant={tab === "team" ? "default" : "outline"} onClick={() => setTab("team")} size="sm">
            <Users className="w-4 h-4 mr-1" /> Our Team
          </Button>
          <Button variant={tab === "hero" ? "default" : "outline"} onClick={() => setTab("hero")} size="sm">
            <Film className="w-4 h-4 mr-1" /> Hero Banner
          </Button>
        </div>

        {tab === "gallery" && (
          <>
            <div className="bg-card border border-border rounded-2xl p-6 mb-8">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <ImagePlus className="w-5 h-5 text-secondary" /> Upload Image ({images.length}/12)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <Input placeholder="Image title (optional)" value={title} onChange={(e) => setTitle(e.target.value)} />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <label
                  className={`flex items-center justify-center gap-2 rounded-md border border-dashed border-secondary/50 bg-secondary/5 px-4 py-2 text-sm font-medium text-secondary cursor-pointer hover:bg-secondary/10 transition-colors ${
                    uploading || images.length >= 12 ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  {uploading ? "Uploading..." : "Choose File"}
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileSelect} disabled={uploading || images.length >= 12} />
                </label>
              </div>
            </div>

            <input ref={galleryReplaceInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />

            {editingGalleryItem && (
              <div className="bg-card border border-border rounded-2xl p-4 mb-4 space-y-3">
                <h3 className="text-sm font-semibold">Edit Gallery Item</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    placeholder="Image title"
                    value={galleryEditTitle}
                    onChange={(e) => setGalleryEditTitle(e.target.value)}
                  />
                  <select
                    value={galleryEditCategory}
                    onChange={(e) => setGalleryEditCategory(e.target.value)}
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="sm" onClick={handleSaveGalleryEdit}>
                    <Check className="w-4 h-4 mr-1" /> Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleReplaceGalleryImageSelect(editingGalleryItem)}>
                    <Upload className="w-4 h-4 mr-1" /> Replace Image
                  </Button>
                  <Button size="sm" variant="outline" onClick={cancelEditGalleryItem}>
                    <X className="w-4 h-4 mr-1" /> Cancel
                  </Button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {images.map((img) => (
                <div key={img.id} className="relative group rounded-xl overflow-hidden border border-border">
                  <img src={img.image_url} alt={img.title || ""} className="w-full aspect-square object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => startEditGalleryItem(img)}>
                      <Edit2 className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(img)}>
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </Button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                    <p className="text-white text-xs truncate">{img.title || "Untitled"}</p>
                    <p className="text-white/60 text-[10px]">{img.category}</p>
                  </div>
                </div>
              ))}
            </div>

            {images.length === 0 && <p className="text-center text-muted-foreground py-12">No images uploaded yet.</p>}
          </>
        )}

        {tab === "notices" && (
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-secondary" /> Add Notice
              </h2>
              <div className="flex gap-2">
                <Input placeholder="Enter notice text..." value={newNotice} onChange={(e) => setNewNotice(e.target.value)} className="flex-1" />
                <Button onClick={handleAddNotice}>
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {notices.map((notice) => (
                <div key={notice.id} className="flex items-center gap-3 bg-card border border-border rounded-xl p-4">
                  <div className="flex-1">
                    {editingNoticeId === notice.id ? (
                      <Input value={editingNoticeText} onChange={(e) => setEditingNoticeText(e.target.value)} />
                    ) : (
                      <p className={`text-sm ${notice.is_active ? "text-foreground" : "text-muted-foreground line-through"}`}>{notice.text}</p>
                    )}
                  </div>
                  {editingNoticeId === notice.id ? (
                    <>
                      <Button variant="outline" size="sm" onClick={handleSaveNoticeEdit}>
                        <Check className="w-4 h-4 mr-1" /> Save
                      </Button>
                      <Button variant="outline" size="sm" onClick={cancelEditNotice}>
                        <X className="w-4 h-4 mr-1" /> Cancel
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => startEditNotice(notice)}>
                      <Edit2 className="w-4 h-4 mr-1" /> Edit
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => handleToggleNotice(notice)}>
                    {notice.is_active ? "Hide" : "Show"}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteNotice(notice.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {notices.length === 0 && <p className="text-center text-muted-foreground py-8">No notices yet.</p>}
            </div>
          </div>
        )}

        {tab === "results" && (
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-secondary" /> Add Student Result
              </h2>

              <div className="mb-3 rounded-lg border border-secondary/20 bg-secondary/5 p-3 text-sm">
                <p className="font-medium">Total Marks: {TOTAL_RESULT_MARKS} (fixed)</p>
                <p className="text-xs text-muted-foreground mt-1">Enter obtained marks only. Percentage and grade are auto calculated.</p>
              </div>

              <div className="mb-3 flex items-center gap-3">
                {rPhotoPreview ? (
                  <img src={rPhotoPreview} alt="Student preview" className="w-12 h-12 rounded-full object-cover object-center border border-border" />
                ) : (
                  <img
                    src={DEFAULT_RESULT_AVATARS[rGender]}
                    alt={`${rGender} default avatar`}
                    className="w-12 h-12 rounded-full object-cover object-center border border-border"
                  />
                )}

                <div className="flex-1">
                  <Button variant="outline" type="button" onClick={() => resultPhotoInputRef.current?.click()}>
                    <Upload className="w-4 h-4 mr-1" /> {rPhotoPreview ? "Change Student Photo" : "Upload Student Photo (Circle Crop)"}
                  </Button>
                  <input
                    ref={resultPhotoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleResultPhotoSelect}
                    className="hidden"
                  />
                </div>
              </div>

              {!rPhotoBlob && (
                <div className="mb-3">
                  <label className="text-xs text-muted-foreground mb-1 block">No photo uploaded: choose gender for default icon</label>
                  <select
                    value={rGender}
                    onChange={(e) => setRGender(e.target.value as ResultGender)}
                    className="w-full sm:w-60 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              )}

              {(() => {
                const safeMarks = Math.max(0, Math.min(TOTAL_RESULT_MARKS, Number(rMarks) || 0));
                const autoPercentage = Number(((safeMarks / TOTAL_RESULT_MARKS) * 100).toFixed(2));
                const autoGrade = getGradeFromPercentage(autoPercentage);

                return (
                  <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm">
                      <p className="text-xs text-muted-foreground">Auto Percentage</p>
                      <p className="font-semibold">{autoPercentage}%</p>
                    </div>
                    <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm">
                      <p className="text-xs text-muted-foreground">Auto Grade</p>
                      <p className="font-semibold">{autoGrade}</p>
                    </div>
                  </div>
                );
              })()}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
                <Input placeholder="Student Name *" value={rName} onChange={(e) => setRName(e.target.value)} />
                <select value={rClass} onChange={(e) => setRClass(e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                  {["Class 5th", "Class 6th", "Class 7th", "Class 8th", "Class 9th", "Class 10th", "Class 11th", "Class 12th"].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <Input
                  placeholder="Obtained Marks *"
                  type="number"
                  min={0}
                  max={TOTAL_RESULT_MARKS}
                  value={rMarks}
                  onChange={(e) => setRMarks(e.target.value)}
                />
                <Input value={`${TOTAL_RESULT_MARKS}`} disabled />
                <select value={rYear} onChange={(e) => setRYear(e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                  {["2024-25", "2023-24", "2022-23", "2021-22", "2020-21"].map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
              <Button onClick={handleAddResult} disabled={uploading || !rName.trim() || !rMarks.trim()}>
                <Plus className="w-4 h-4 mr-1" /> Add Result
              </Button>
            </div>

            <div className="space-y-2">
              {results.map((result) => (
                <div key={result.id} className="flex items-center gap-3 bg-card border border-border rounded-xl p-4">
                  {editingResultId === result.id ? (
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                        <Input value={editResultName} onChange={(e) => setEditResultName(e.target.value)} placeholder="Student name" />
                        <select
                          value={editResultClass}
                          onChange={(e) => setEditResultClass(e.target.value)}
                          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          {["Class 5th", "Class 6th", "Class 7th", "Class 8th", "Class 9th", "Class 10th", "Class 11th", "Class 12th"].map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                        <Input
                          type="number"
                          min={0}
                          max={TOTAL_RESULT_MARKS}
                          value={editResultMarks}
                          onChange={(e) => setEditResultMarks(e.target.value)}
                          placeholder="Obtained marks"
                        />
                        <select
                          value={editResultYear}
                          onChange={(e) => setEditResultYear(e.target.value)}
                          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          {["2024-25", "2023-24", "2022-23", "2021-22", "2020-21"].map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        {editResultPhotoPreview ? (
                          <img src={editResultPhotoPreview} alt="Student preview" className="w-10 h-10 rounded-full object-cover object-center border border-border" />
                        ) : (
                          <div className="w-10 h-10 rounded-full border border-dashed border-border flex items-center justify-center text-[10px] text-muted-foreground">
                            Photo
                          </div>
                        )}
                        <Button variant="outline" size="sm" onClick={() => editResultPhotoInputRef.current?.click()}>
                          <Upload className="w-4 h-4 mr-1" /> Change Photo
                        </Button>
                        <input
                          ref={editResultPhotoInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleEditResultPhotoSelect}
                          className="hidden"
                        />
                      </div>

                      {!editResultPhotoBlob && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-muted-foreground mb-1 block">Gender</label>
                            <select
                              value={editResultGender}
                              onChange={(e) => setEditResultGender(e.target.value as ResultGender)}
                              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                            </select>
                            <p className="text-[11px] text-muted-foreground mt-1">
                              Used when no custom photo is uploaded.
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-2">
                        <Button size="sm" onClick={() => handleSaveResultEdit(result)} disabled={uploading}>
                          <Check className="w-4 h-4 mr-1" /> Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEditResult}>
                          <X className="w-4 h-4 mr-1" /> Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{result.student_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {result.student_class} • {result.year} • {result.percentage}% • Grade {result.grade}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => startEditResult(result)}>
                        <Edit2 className="w-4 h-4 mr-1" /> Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteResult(result)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              ))}
              {results.length === 0 && <p className="text-center text-muted-foreground py-8">No results yet.</p>}
            </div>
          </div>
        )}

        {tab === "team" && (
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <h2 className="font-semibold mb-1 flex items-center gap-2">
                <Users className="w-5 h-5 text-secondary" /> Update Our Team
              </h2>
              <p className="text-xs text-muted-foreground">Upload team image, qualification, two points, and mobile number.</p>

              <div className="flex items-center gap-3">
                {teamImageUrl ? (
                  <img src={teamImageUrl} alt="Team preview" className="w-16 h-16 rounded-full object-cover border border-border" />
                ) : (
                  <div className="w-16 h-16 rounded-full border border-dashed border-border flex items-center justify-center text-xs text-muted-foreground">
                    Photo
                  </div>
                )}

                <div>
                  <Button variant="outline" type="button" onClick={() => teamPhotoInputRef.current?.click()} disabled={uploading}>
                    <Upload className="w-4 h-4 mr-1" /> {teamImageUrl ? "Change Team Image" : "Upload Team Image (Circle Crop)"}
                  </Button>
                  <input
                    ref={teamPhotoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleTeamImageSelect}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  placeholder="Team member name"
                  value={teamFormData.name}
                  onChange={(e) => setTeamFormData({ ...teamFormData, name: e.target.value })}
                />
                <Input
                  placeholder="Role (e.g., Director & Founder)"
                  value={teamFormData.role}
                  onChange={(e) => setTeamFormData({ ...teamFormData, role: e.target.value })}
                />
                <Input
                  placeholder="Qualification"
                  value={teamFormData.qualification}
                  onChange={(e) => setTeamFormData({ ...teamFormData, qualification: e.target.value })}
                />
                <Input
                  placeholder="Mobile number"
                  value={teamFormData.mobile_number}
                  onChange={(e) => setTeamFormData({ ...teamFormData, mobile_number: e.target.value })}
                />
                <Input
                  placeholder="Point 1 (e.g., 10+ Years Experience)"
                  value={teamFormData.point_one}
                  onChange={(e) => setTeamFormData({ ...teamFormData, point_one: e.target.value })}
                />
                <Input
                  placeholder="Point 2 (e.g., Expert in Board Exams)"
                  value={teamFormData.point_two}
                  onChange={(e) => setTeamFormData({ ...teamFormData, point_two: e.target.value })}
                />
              </div>

              <Button onClick={handleSaveTeamMember} disabled={uploading}>
                <Plus className="w-4 h-4 mr-1" /> Save Team Details
              </Button>

              <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm">
                <p className="font-medium">Live Preview Summary</p>
                <p className="text-xs text-muted-foreground mt-1">{teamFormData.name || "Name"} • {teamFormData.role || "Role"}</p>
                <p className="text-xs text-muted-foreground mt-1 inline-flex items-center gap-1"><Award className="w-3.5 h-3.5" /> {teamFormData.qualification || "Qualification"}</p>
                <p className="text-xs text-muted-foreground mt-1 inline-flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {teamFormData.mobile_number || "Mobile number"}</p>
              </div>
            </div>
          </div>
        )}

        {tab === "hero" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold flex items-center gap-2">
                <Film className="w-5 h-5 text-secondary" /> Hero Banners
              </h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleImportProvidedPathBanners} disabled={uploading}>
                  <Film className="w-4 h-4 mr-1" /> Use Provided Paths
                </Button>
                <Button variant="outline" size="sm" onClick={() => multiHeroFileInputRef.current?.click()} disabled={uploading}>
                  <Upload className="w-4 h-4 mr-1" /> {uploading ? "Uploading..." : "Add Multiple"}
                </Button>
                <input
                  ref={multiHeroFileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleHeroBulkFileSelect}
                  className="hidden"
                />

                {!showHeroForm && (
                  <Button onClick={openAddHeroForm} size="sm">
                    <Plus className="w-4 h-4 mr-1" /> Add Banner
                  </Button>
                )}
              </div>
            </div>

            {showHeroForm && (
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                <h3 className="font-semibold text-sm">{heroEditingId ? "Edit Hero Banner" : "Add Hero Banner"}</h3>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Banner Image *</label>
                  {heroImageUrl && (
                    <div className="mb-2 rounded-lg overflow-hidden border border-border">
                      <img src={heroImageUrl} alt="preview" className="w-full h-32 object-cover" />
                    </div>
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full flex items-center justify-center gap-2 rounded-md border border-dashed border-secondary/50 bg-secondary/5 px-4 py-3 text-sm font-medium text-secondary cursor-pointer hover:bg-secondary/10 transition-colors disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    {uploading ? "Uploading..." : "Upload Image"}
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleHeroFileSelect} className="hidden" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    placeholder="Banner Title (optional)"
                    value={heroFormData.title}
                    onChange={(e) => setHeroFormData({ ...heroFormData, title: e.target.value })}
                  />
                  <Input
                    placeholder="Subtitle"
                    value={heroFormData.subtitle}
                    onChange={(e) => setHeroFormData({ ...heroFormData, subtitle: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Primary CTA Label</label>
                    <Input
                      placeholder="e.g., Join Coaching"
                      value={heroFormData.cta_label}
                      onChange={(e) => setHeroFormData({ ...heroFormData, cta_label: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Primary CTA Link</label>
                    <Input
                      placeholder="e.g., /coaching"
                      value={heroFormData.cta_link}
                      onChange={(e) => setHeroFormData({ ...heroFormData, cta_link: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Secondary CTA Label</label>
                    <Input
                      placeholder="e.g., Contact"
                      value={heroFormData.cta_secondary_label}
                      onChange={(e) => setHeroFormData({ ...heroFormData, cta_secondary_label: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Secondary CTA Link</label>
                    <Input
                      placeholder="e.g., /contact"
                      value={heroFormData.cta_secondary_link}
                      onChange={(e) => setHeroFormData({ ...heroFormData, cta_secondary_link: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="hero_active"
                    checked={heroFormData.is_active}
                    onChange={(e) => setHeroFormData({ ...heroFormData, is_active: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="hero_active" className="text-sm font-medium">
                    Active
                  </label>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button onClick={handleHeroSave} disabled={uploading || !heroImageUrl} className="flex-1">
                    <Plus className="w-4 h-4 mr-1" />
                    {heroEditingId ? "Update" : "Create"}
                  </Button>
                  <Button variant="outline" onClick={resetHeroForm} className="flex-1">
                    <X className="w-4 h-4 mr-1" /> Cancel
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Uploaded Hero Banners</h3>
                <span className="text-xs text-muted-foreground">{banners.length} total</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {banners.map((banner, idx) => (
                  <div key={banner.id} className="bg-card border border-border rounded-xl overflow-hidden">
                    <img src={banner.image_url} alt={banner.title || "Hero banner"} className="w-full h-40 object-cover" />
                    <div className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-foreground">{banner.title || "Untitled banner"}</p>
                          {banner.subtitle && <p className="text-xs text-muted-foreground mt-1">{banner.subtitle}</p>}
                        </div>
                        <span className="text-[10px] px-2 py-1 rounded-full border border-border text-muted-foreground">Order {idx + 1}</span>
                      </div>

                      <p className="text-xs text-muted-foreground">{banner.cta_label || "No CTA"}</p>

                      <div className="flex items-center gap-2 pt-2">
                        <Button variant="outline" size="sm" onClick={() => handleHeroToggleActive(banner)}>
                          {banner.is_active ? <Eye className="w-4 h-4 mr-1" /> : <EyeOff className="w-4 h-4 mr-1" />}
                          {banner.is_active ? "Active" : "Hidden"}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleHeroEdit(banner)}>
                          <Edit2 className="w-4 h-4 mr-1" /> Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleHeroDelete(banner.id, banner.image_url)}>
                          <Trash2 className="w-4 h-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {banners.length === 0 && <p className="text-center text-muted-foreground py-8">No hero banners yet.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGallery;