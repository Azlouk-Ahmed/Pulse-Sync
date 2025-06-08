import ExaminationCard from '../components/ExamCard'
import { useFetchData } from '../hooks/useFetchData'

function ExamPage() {

const {loading, error, data} = useFetchData("/examen") 

 return (
    <div className='flex flex-wrap gap-y-10'>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {data && data.data.length > 0 ? (
        data.data.map((exam) => (
          <ExaminationCard key={exam._id} data={exam} />
        ))
      ) : (
        <p>No exams found.</p>
      )}
    </div>
  )
}

export default ExamPage