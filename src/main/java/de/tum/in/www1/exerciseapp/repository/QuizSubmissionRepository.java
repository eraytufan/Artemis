package de.tum.in.www1.exerciseapp.repository;

import de.tum.in.www1.exerciseapp.domain.QuizSubmission;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the QuizSubmission entity.
 */
@SuppressWarnings("unused")
@Repository
public interface QuizSubmissionRepository extends JpaRepository<QuizSubmission, Long> {

}
