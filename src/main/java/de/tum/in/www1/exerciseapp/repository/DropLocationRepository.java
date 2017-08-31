package de.tum.in.www1.exerciseapp.repository;

import de.tum.in.www1.exerciseapp.domain.DropLocation;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the DropLocation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DropLocationRepository extends JpaRepository<DropLocation, Long> {

}
