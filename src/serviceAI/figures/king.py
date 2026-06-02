from abstractFIgures import AbstractFigure
from board import Board

class King(AbstractFigure):
    def move(self, selectedFig: dict['x': int, 'y': int], colorFig: str, board: Board ) -> list[tuple[tuple[int, int], tuple[int, int]]] | None:
