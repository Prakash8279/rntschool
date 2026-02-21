import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { 
  fetchAssignmentsByClass, submitAssignment, 
  fetchQuizzesByClass, fetchQuizForTaking, submitQuiz, clearCurrentQuiz,
  fetchStudentSubmission, fetchStudentQuizSubmission
} from "@/store/slices/assignmentSlice";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, HelpCircle, Clock, CheckCircle, Send, AlertCircle, Lock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function StudentAssignmentsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { userInfo: user } = useSelector((state: RootState) => state.auth);
  const { assignments, quizzes, currentQuiz, loading, error, myAssignmentSubmissions, myQuizSubmissions } = useSelector((state: RootState) => state.assignment);

  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [submissionText, setSubmissionText] = useState("");
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);

  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<{[key: number]: string}>({});
  const [quizStarted, setQuizStarted] = useState<Date | null>(null);

  const studentClass = (user as any)?.classname || "";
  const admissionNo = (user as any)?.admission_no || "";

  useEffect(() => {
    if (studentClass) {
      dispatch(fetchAssignmentsByClass(studentClass));
      dispatch(fetchQuizzesByClass(studentClass));
    } else {
      console.warn("Student classname is missing. User may need to re-login.");
    }
  }, [dispatch, studentClass]);

  // Check submission status for each assignment and quiz once loaded
  useEffect(() => {
    if (admissionNo && assignments.length > 0) {
      assignments.forEach((a: any) => {
        if (!myAssignmentSubmissions[a._id]) {
          dispatch(fetchStudentSubmission({ assignmentId: a._id, admissionNo }));
        }
      });
    }
  }, [dispatch, assignments, admissionNo]);

  useEffect(() => {
    if (admissionNo && quizzes.length > 0) {
      quizzes.forEach((q: any) => {
        if (!myQuizSubmissions[q._id]) {
          dispatch(fetchStudentQuizSubmission({ quizId: q._id, admissionNo }));
        }
      });
    }
  }, [dispatch, quizzes, admissionNo]);

  const handleOpenAssignment = (assignment: any) => {
    setSelectedAssignment(assignment);
    // Pre-fill with previous submission text if re-submitting
    const prev = myAssignmentSubmissions[assignment._id];
    setSubmissionText(prev?.submission_text || "");
    setIsSubmitOpen(true);
  };

  const handleSubmitAssignment = async () => {
    if (!submissionText.trim()) {
      toast({ title: "Error", description: "Please write your answer", variant: "destructive" });
      return;
    }

    const result = await dispatch(submitAssignment({
      assignment_id: selectedAssignment._id,
      student_id: user?._id,
      admission_no: admissionNo,
      student_name: user?.name,
      classname: studentClass,
      submission_text: submissionText
    }));

    if (submitAssignment.fulfilled.match(result)) {
      toast({ title: "Submitted!", description: "Your assignment has been submitted" });
      // Refresh submission status
      dispatch(fetchStudentSubmission({ assignmentId: selectedAssignment._id, admissionNo }));
    } else {
      toast({ title: "Error", description: "Failed to submit assignment", variant: "destructive" });
    }
    setIsSubmitOpen(false);
    setSelectedAssignment(null);
    setSubmissionText("");
  };

  const getQuizTimeStatus = (quiz: any): 'upcoming' | 'active' | 'expired' => {
    const now = new Date();
    if (quiz.start_time && new Date(quiz.start_time) > now) return 'upcoming';
    if (quiz.end_time && new Date(quiz.end_time) < now) return 'expired';
    return 'active';
  };

  const handleStartQuiz = async (quiz: any) => {
    // Check if already submitted
    const existingSub = myQuizSubmissions[quiz._id];
    if (existingSub) {
      toast({ title: "Already Submitted", description: `You already submitted this quiz. Score: ${existingSub.total_marks || 0}/${quiz.total_marks}`, variant: "destructive" });
      return;
    }

    // Check time window
    const timeStatus = getQuizTimeStatus(quiz);
    if (timeStatus === 'upcoming') {
      toast({ title: "Not Started", description: `This quiz starts at ${new Date(quiz.start_time).toLocaleString()}`, variant: "destructive" });
      return;
    }
    if (timeStatus === 'expired') {
      toast({ title: "Expired", description: "This quiz time has ended", variant: "destructive" });
      return;
    }

    await dispatch(fetchQuizForTaking(quiz._id));
    setQuizAnswers({});
    setQuizStarted(new Date());
    setIsQuizOpen(true);
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmitQuiz = async () => {
    if (!currentQuiz) return;

    const answersArray = Object.entries(quizAnswers).map(([qId, answer]) => ({
      question_id: parseInt(qId),
      answer
    }));

    const result = await dispatch(submitQuiz({
      quiz_id: currentQuiz._id,
      student_id: user?._id,
      admission_no: admissionNo,
      student_name: user?.name,
      classname: studentClass,
      answers: answersArray,
      started_at: quizStarted?.toISOString()
    }));

    if (submitQuiz.fulfilled.match(result)) {
      toast({ title: "Quiz Submitted!", description: "Your quiz has been submitted successfully" });
      // Refresh quiz submission status
      dispatch(fetchStudentQuizSubmission({ quizId: currentQuiz._id, admissionNo }));
    } else {
      toast({ title: "Error", description: "Failed to submit quiz. You may have already submitted.", variant: "destructive" });
    }
    setIsQuizOpen(false);
    dispatch(clearCurrentQuiz());
    setQuizAnswers({});
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Assignments & Quizzes</h1>
        <p className="text-muted-foreground">View and submit your assignments and quizzes — Class: {studentClass || "Unknown"}</p>
      </div>

      {!studentClass && (
        <Card className="border-yellow-400 bg-yellow-50">
          <CardContent className="pt-6 text-center text-yellow-800">
            <AlertCircle className="w-5 h-5 inline mr-2" />
            Your class information is missing. Please <strong>logout and login again</strong> to load your assignments and quizzes.
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-red-400 bg-red-50">
          <CardContent className="pt-6 text-center text-red-800">
            <AlertCircle className="w-5 h-5 inline mr-2" />
            Failed to load data: {error}
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="assignments">
        <TabsList>
          <TabsTrigger value="assignments" className="flex items-center gap-2">
            <FileText className="w-4 h-4" /> Assignments ({assignments.length})
          </TabsTrigger>
          <TabsTrigger value="quizzes" className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4" /> Quizzes ({quizzes.length})
          </TabsTrigger>
        </TabsList>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="space-y-4 mt-4">
          {loading ? (
            <p>Loading...</p>
          ) : assignments.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No assignments available for your class.
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assignments.map((a: any) => {
                const mySub = myAssignmentSubmissions[a._id];
                return (
                  <Card key={a._id} className={`hover:shadow-lg transition-shadow ${mySub ? 'border-green-300' : ''}`}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{a.title}</CardTitle>
                        {mySub ? (
                          mySub.is_graded ? (
                            <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> {mySub.marks_obtained}/{a.max_marks}</Badge>
                          ) : (
                            <Badge className="bg-blue-500"><CheckCircle className="w-3 h-3 mr-1" /> Submitted</Badge>
                          )
                        ) : a.due_date ? (
                          isOverdue(a.due_date) ? (
                            <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" /> Overdue</Badge>
                          ) : (
                            <Badge><Clock className="w-3 h-3 mr-1" /> Due: {a.due_date}</Badge>
                          )
                        ) : null}
                      </div>
                      <CardDescription>{a.subject} | {a.teacher_name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{a.description || "No description"}</p>
                      {mySub?.is_graded && mySub.remarks && (
                        <p className="text-xs text-green-700 bg-green-50 p-2 rounded mb-3">
                          <strong>Feedback:</strong> {mySub.remarks}
                        </p>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Max Marks: {a.max_marks}</span>
                        <Button size="sm" onClick={() => handleOpenAssignment(a)}>
                          <Send className="w-4 h-4 mr-2" /> {mySub ? "Resubmit" : "Submit"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Quizzes Tab */}
        <TabsContent value="quizzes" className="space-y-4 mt-4">
          {loading ? (
            <p>Loading...</p>
          ) : quizzes.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No quizzes available for your class.
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quizzes.map((q: any) => {
                const mySub = myQuizSubmissions[q._id];
                const timeStatus = getQuizTimeStatus(q);
                return (
                  <Card key={q._id} className={`hover:shadow-lg transition-shadow ${mySub ? 'border-green-300' : timeStatus === 'expired' ? 'border-red-200 opacity-75' : ''}`}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{q.title}</CardTitle>
                        {mySub ? (
                          <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> {mySub.total_marks || 0}/{q.total_marks}</Badge>
                        ) : timeStatus === 'expired' ? (
                          <Badge variant="destructive"><Lock className="w-3 h-3 mr-1" /> Expired</Badge>
                        ) : timeStatus === 'upcoming' ? (
                          <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" /> Upcoming</Badge>
                        ) : (
                          <Badge><Clock className="w-3 h-3 mr-1" /> {q.duration_minutes} mins</Badge>
                        )}
                      </div>
                      <CardDescription>{q.subject} | {q.teacher_name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">{q.description || "No description"}</p>
                      {q.start_time && (
                        <p className="text-xs text-muted-foreground mb-1">
                          Start: {new Date(q.start_time).toLocaleString()}
                        </p>
                      )}
                      {q.end_time && (
                        <p className="text-xs text-muted-foreground mb-3">
                          End: {new Date(q.end_time).toLocaleString()}
                        </p>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Total Marks: {q.total_marks}</span>
                        {mySub ? (
                          <Badge variant="outline" className="text-green-600">Completed</Badge>
                        ) : (
                          <Button size="sm" onClick={() => handleStartQuiz(q)} disabled={timeStatus !== 'active'}>
                            <HelpCircle className="w-4 h-4 mr-2" /> Start Quiz
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Assignment Submit Dialog */}
      <Dialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedAssignment?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded">
              <p className="text-sm"><strong>Subject:</strong> {selectedAssignment?.subject}</p>
              <p className="text-sm"><strong>Teacher:</strong> {selectedAssignment?.teacher_name}</p>
              <p className="text-sm"><strong>Due Date:</strong> {selectedAssignment?.due_date || "No deadline"}</p>
              <p className="text-sm"><strong>Max Marks:</strong> {selectedAssignment?.max_marks}</p>
            </div>
            {selectedAssignment?.description && (
              <div>
                <Label>Instructions:</Label>
                <p className="text-sm p-2 bg-muted rounded">{selectedAssignment.description}</p>
              </div>
            )}
            {myAssignmentSubmissions[selectedAssignment?._id] && (
              <div className="p-3 bg-blue-50 rounded text-sm border border-blue-200">
                <p className="font-medium text-blue-700">You have already submitted this assignment.</p>
                <p className="text-blue-600">Submitting again will update your previous answer.</p>
              </div>
            )}
            <div>
              <Label>Your Answer *</Label>
              <Textarea 
                value={submissionText}
                onChange={e => setSubmissionText(e.target.value)}
                placeholder="Write your answer here..."
                className="min-h-[200px]"
              />
            </div>
            <Button onClick={handleSubmitAssignment} className="w-full">
              <CheckCircle className="w-4 h-4 mr-2" /> 
              {myAssignmentSubmissions[selectedAssignment?._id] ? "Update Submission" : "Submit Assignment"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quiz Dialog */}
      <Dialog open={isQuizOpen} onOpenChange={(open) => {
        if (!open && confirm("Are you sure you want to exit? Your progress will be lost.")) {
          setIsQuizOpen(false);
          dispatch(clearCurrentQuiz());
        }
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentQuiz?.title}</DialogTitle>
            <p className="text-sm text-muted-foreground">
              {currentQuiz?.subject} | Duration: {currentQuiz?.duration_minutes} mins | Total: {currentQuiz?.total_marks} marks
            </p>
          </DialogHeader>
          
          {currentQuiz?.questions && (
            <div className="space-y-6">
              {currentQuiz.questions.map((q: any, idx: number) => (
                <Card key={q.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex justify-between">
                      <span>Q{idx + 1}. {q.question}</span>
                      <Badge variant="outline">{q.marks} marks</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {q.type === "mcq" ? (
                      <RadioGroup 
                        value={quizAnswers[q.id] || ""} 
                        onValueChange={v => handleAnswerChange(q.id, v)}
                      >
                        {q.options?.map((opt: string, i: number) => (
                          <div key={i} className="flex items-center space-x-2">
                            <RadioGroupItem value={opt} id={`q${q.id}-opt${i}`} />
                            <Label htmlFor={`q${q.id}-opt${i}`}>{opt}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    ) : (
                      <Textarea 
                        value={quizAnswers[q.id] || ""}
                        onChange={e => handleAnswerChange(q.id, e.target.value)}
                        placeholder="Type your answer here..."
                        className="min-h-[100px]"
                      />
                    )}
                  </CardContent>
                </Card>
              ))}

              <div className="flex justify-between items-center pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Answered: {Object.keys(quizAnswers).length} / {currentQuiz.questions.length}
                </p>
                <Button onClick={handleSubmitQuiz} size="lg">
                  <CheckCircle className="w-4 h-4 mr-2" /> Submit Quiz
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
