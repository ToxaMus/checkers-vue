from abstractFIgures import AbstractFigure
from board import Board
from typing import List, Tuple, Dict, Any, Optional

class Checker(AbstractFigure):
    
    def move(self, selected_fig: Dict[str, int], color_fig: str, board: Board) -> Optional[List[Tuple[Tuple[int, int], Tuple[int, int], bool]]]:
        """
        Возвращает список возможных ходов для шашки.
        Взятие может быть как вперёд, так и назад!
        """
        # Находим все возможные клетки для хода
        possible_moves = self.__find_moves(selected_fig, color_fig, board)
        
        # Отделяем врагов от пустых клеток
        enemies = [{'x': enemy['x'], 'y': enemy['y']} for enemy in possible_moves if enemy['figure'] != 0]
        
        # Оставляем только пустые клетки для обычных ходов
        empty_moves = [move for move in possible_moves if move['figure'] == 0]

        # Если есть враги — нужно проверять взятие (В ТОМ ЧИСЛЕ НАЗАД!)
        if enemies:
            eat_moves = []
            for enemy in enemies:
                target_cell = self.__find_moves_for_eat(enemy, selected_fig, board)
                if target_cell is not None:
                    eat_moves.append({'x': target_cell[0], 'y': target_cell[1]})
            
            # Если есть взятия — возвращаем только их (обязательные ходы)
            if eat_moves:
                return self.array_sorting(selected_figure=selected_fig, moves=eat_moves, is_eat=True)
        
        # Если нет взятий — возвращаем обычные ходы (только вперёд)
        if empty_moves:
            return self.array_sorting(selected_figure=selected_fig, moves=empty_moves, is_eat=False)
        
        return None

    def __find_moves(self, fig: Dict[str, int], color: str, board: Board) -> List[Dict[str, Any]]:
        """
        Находит все клетки, куда потенциально может пойти шашка.
        Для простых ходов — только вперёд.
        Для потенциальных взятий — ВСЕ диагонали (включая назад)!
        """
        possible_moves = []
        x, y = fig['x'], fig['y']

        for dx, dy in self.DIRECTIONS:
            new_x = x + dx
            new_y = y + dy

            # Проверка границ доски
            if not (0 <= new_x < board.width and 0 <= new_y < board.height):
                continue

            figure = board.get_figure(new_x, new_y)

            # Если клетка пуста — проверяем, можно ли сходить (только вперёд)
            if figure == 0:
                # Проверяем направление для обычного хода (только вперёд)
                if self._is_forward_direction(dx, color):
                    possible_moves.append({'figure': figure, 'x': new_x, 'y': new_y})
            
            # Если на клетке фигура — проверяем, враг ли это (для взятия)
            elif figure is not None:
                is_enemy = (figure > 0 and color == 'BLACK') or (figure < 0 and color == 'WHITE')
                if is_enemy:
                    # Для взятия разрешены ВСЕ направления (включая назад)!
                    possible_moves.append({'figure': figure, 'x': new_x, 'y': new_y})

        return possible_moves
    
    def __find_moves_for_eat(self, enemy: Dict[str, Any], selected: Dict[str, int], board: Board) -> Optional[Tuple[int, int]]:
        """
        Проверяет, может ли шашка съесть врага и вернуть клетку, куда встать после взятия.
        Взятие возможно в ЛЮБОМ направлении (включая назад)!
        """
        # Направление от выбранной фигуры к врагу
        dx = 1 if enemy['x'] > selected['x'] else -1
        dy = 1 if enemy['y'] > selected['y'] else -1

        new_x = enemy['x'] + dx
        new_y = enemy['y'] + dy

        # Проверяем, что клетка за врагом в пределах доски
        if not (0 <= new_x < board.width and 0 <= new_y < board.height):
            return None
        
        # Клетка за врагом должна быть пустой
        if board.get_figure(new_x, new_y) == 0:
            return (new_x, new_y)
        
        return None
