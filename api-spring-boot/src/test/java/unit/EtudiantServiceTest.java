package unit;

import com.example.etudiants.dto.EtudiantDTO;
import com.example.etudiants.entity.Etudiant;
import com.example.etudiants.exception.ResourceNotFoundException;
import com.example.etudiants.mapper.EtudiantMapper;
import com.example.etudiants.repository.EtudiantRepository;
import com.example.etudiants.service.EtudiantService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EtudiantServiceTest {

    @Mock
    private EtudiantRepository repository;

    @Mock
    private EtudiantMapper mapper;

    @Mock
    private com.example.etudiants.kafka.KafkaProducerService kafkaProducerService;

    @InjectMocks
    private EtudiantService service;

    @Test
    void shouldReturnAllEtudiants() {
        // given
        Etudiant etudiant = new Etudiant();
        when(repository.findAll()).thenReturn(List.of(etudiant));
        when(mapper.toDTO(etudiant)).thenReturn(new EtudiantDTO());

        // when
        List<EtudiantDTO> result = service.findAll();

        // then
        assertThat(result).hasSize(1);
        verify(repository).findAll();
    }

    @Test
    void shouldFindById() {
        // given
        Long id = 1L;
        Etudiant etudiant = new Etudiant();
        etudiant.setId(id);
        when(repository.findById(id)).thenReturn(Optional.of(etudiant));
        when(mapper.toDTO(etudiant)).thenReturn(new EtudiantDTO());

        // when
        EtudiantDTO result = service.findById(id);

        // then
        assertThat(result).isNotNull();
        verify(repository).findById(id);
    }

    @Test
    void shouldThrowExceptionWhenNotFound() {
        // given
        Long id = 1L;
        when(repository.findById(id)).thenReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> service.findById(id))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void shouldSaveEtudiant() {
        // given
        EtudiantDTO dto = new EtudiantDTO();
        Etudiant entity = new Etudiant();
        when(mapper.toEntity(dto)).thenReturn(entity);
        when(repository.save(entity)).thenReturn(entity);
        when(mapper.toDTO(entity)).thenReturn(dto);

        // when
        EtudiantDTO result = service.save(dto);

        // then
        assertThat(result).isEqualTo(dto);
        verify(repository).save(entity);
    }

    @Test
    void shouldUpdateEtudiant() {
        // given
        Long id = 1L;
        EtudiantDTO dto = new EtudiantDTO();
        Etudiant entity = new Etudiant();
        when(repository.existsById(id)).thenReturn(true);
        when(mapper.toEntity(dto)).thenReturn(entity);
        when(repository.save(entity)).thenReturn(entity);
        when(mapper.toDTO(entity)).thenReturn(dto);

        // when
        EtudiantDTO result = service.update(id, dto);

        // then
        assertThat(result).isEqualTo(dto);
        assertThat(entity.getId()).isEqualTo(id);
    }

    @Test
    void shouldDeleteEtudiant() {
        // given
        Long id = 1L;
        when(repository.existsById(id)).thenReturn(true);

        // when
        service.delete(id);

        // then
        verify(repository).deleteById(id);
    }

    @Test
    void shouldFindByAnnee() {
        // given
        int annee = 2023;
        Etudiant etudiant = new Etudiant();
        when(repository.findByAnneePremiereInscription(annee)).thenReturn(List.of(etudiant));
        when(mapper.toDTO(etudiant)).thenReturn(new EtudiantDTO());

        // when
        List<EtudiantDTO> result = service.findByAnnee(annee);

        // then
        assertThat(result).hasSize(1);
    }
}
